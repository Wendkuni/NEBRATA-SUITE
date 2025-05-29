import { Injectable } from '@angular/core';
import {GenericDatasource} from "@sycadApp/models/generic-datasource";
import {
  IlotElement,
  PaginatedResponse, ParcelleMap
} from "@sycadApp/models/data-references/territoire/localite.model";
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import { environment } from 'environments/environment';
import { Observable, tap } from 'rxjs';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';


@Injectable()
export class IlotService extends GenericDatasource<IlotElement, IlotElement, IlotElement >{

  constructor(public http: HttpClient) {super(http); }

  getUrl(): string {
    return  environment.TERRITOIRE.ILOT_API;
  }

  public autocompletionPublic(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<IlotElement[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "12")
      .set(this.mapping.searchName, search);
      otherParams.forEach((value: string, key: any) => {
          params=params.set(key,value);
      });

      return this.http.get<IlotElement[]>(this.getUrl() + "/public/autocomplete", {
      observe: "response",
      params,
    }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }
 public autocompletionPublicBySectionAndArrondissement(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<IlotElement[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "12")
      .set(this.mapping.searchName, search);
      otherParams.forEach((value: string, key: any) => {
          params=params.set(key,value);
      });

      return this.http.get<IlotElement[]>(this.getUrl() + "/public/autocomplete_by_section_arrondissement", {
      observe: "response",
      params,
    }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }

  getIlotsByCodeCommuneAndNumeroSection( codeCommune: string,numeroSection: string): Observable<IlotElement[]>{
    return this.http.get<IlotElement[]>(environment.USERS.GEOSERVER_API + `/ilots/${codeCommune}/${numeroSection}`)
      // .pipe(
      // map(ilot => this.removeDuplicates(ilot))
    // )
    ;
  }

  getIlots(
    codeArrondissement: string,
    codeCommune: string,
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedResponse<IlotElement>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<IlotElement>>(
      environment.USERS.GEOSERVER_API+`/liste_ilots_par_arrondissement/${codeArrondissement}/${codeCommune}`,
      { params }
    );
  }

  getParcellesByArrondissement(
    codeArrondissement: string,
    codeCommune: string,
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedResponse<ParcelleMap>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<ParcelleMap>>(
      environment.USERS.GEOSERVER_API+`/liste_ilots_par_arrondissement_et_commune/${codeArrondissement}/${codeCommune}`,
      { params }
    );
  }
}
