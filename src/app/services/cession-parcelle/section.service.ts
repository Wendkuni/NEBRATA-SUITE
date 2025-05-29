import { Injectable } from '@angular/core';
import {GenericDatasource} from "@sycadApp/models/generic-datasource";
import {Section} from "@sycadApp/models/data-references/contribuables/global.model";
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import { environment } from 'environments/environment';
import {Observable, of, tap} from 'rxjs';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';
import {MatSnackBar} from "@angular/material/snack-bar";


@Injectable()
export class SectionService extends GenericDatasource<Section, Section, Section>{
  constructor(public http: HttpClient, public _snackBar: MatSnackBar) { super(http);}
  getUrl(): string {
    return environment.USERS.SECTION_API;
  }


  public autocompletionPublic(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<Section[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "12")
      .set(this.mapping.searchName, search);
      otherParams.forEach((value: string, key: any) => {
          params=params.set(key,value);
      });

      return this.http.get<Section[]>(this.getUrl() + "/public/autocomplete", {
      observe: "response",
      params,
    }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }

  public autocompletionByArrondissement(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<Section[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "12")
      .set(this.mapping.searchName, search);
    otherParams.forEach((value: string, key: any) => {
      params=params.set(key,value);
    });

    return this.http.get<Section[]>(this.getUrl() + "/public/autocompleteByArrondissement", {
      observe: "response",
      params,
    }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }

  getSectionsByCodeCommune( codeCommune: string): Observable<Section[]>{
    return this.http.get<Section[]>(environment.USERS.GEOSERVER_API + `/sections/${codeCommune}`);
  }
  removeSectionById(idSection: Number, numeroDossier: string): Observable<void> {
    return this.http.delete<void>(environment.SAISIE_DIFFEREE.SAISIE_DIFFEREE_SECTIONNEMENT_API +
      `/suppression_section/${idSection}?numeroDossier=${numeroDossier}`);
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: "top",
    });
  }

}
