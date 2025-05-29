import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import { ArrondissementItem, ArrondissementAutocomplete, ArrondissementElement } from '@sycadApp/models/data-references/territoire/arrondissement.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';
import { environment } from 'environments/environment';

@Injectable()
export class ArrondissementsService extends GenericDatasource<ArrondissementItem, ArrondissementElement,ArrondissementAutocomplete>{

  constructor(public http: HttpClient) {
    super(http);
  }
  getUrl(): string {
    return environment.TERRITOIRE.ARRONDISSEMENTS_API;
  }
  public deleteZones(idArrondissement: number, id: number) {
    return this.http.delete(`${environment.TERRITOIRE.ARRONDISSEMENTS_API}/${idArrondissement}/arrondissement-zone` + "/" + id);
  }

  public autocompletionByZoneCompetences(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<ArrondissementAutocomplete[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "12")
      .set(this.mapping.searchName, search);
      otherParams.forEach((value: string, key: any) => {
          params=params.set(key,value);
      });

      return this.http.get<ArrondissementAutocomplete[]>(this.getUrl() + "/autocomplete-by-zone-competence", {
      observe: "response",
      params,
    }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }

  public autocompletionByCommune(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<ArrondissementAutocomplete[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "12")
      .set(this.mapping.searchName, search);
    otherParams.forEach((value: string, key: any) => {
      params=params.set(key,value);
    });

    return this.http.get<ArrondissementAutocomplete[]>(this.getUrl() + "/autocomplete-by-commune", {
      observe: "response",
      params,
    }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }

}
