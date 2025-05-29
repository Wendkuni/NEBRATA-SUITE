import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import { LocaliteAutocomplete, LocaliteItem, LocaliteElement } from '@sycadApp/models/data-references/territoire/localite.model';
import { environment } from 'environments/environment';
import { Observable, tap } from 'rxjs';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';

@Injectable()
export class LocaliteService extends GenericDatasource<LocaliteItem,LocaliteElement,LocaliteAutocomplete> {

  constructor(public  http: HttpClient) {
    super(http);
  }
  getUrl(): string {
    return environment.TERRITOIRE.LOCALITES_API;
  }

  public autocompletionByCommune(search: string, idCommune: number, otherParams: Map<string,any>=null): Observable<HttpResponse<LocaliteAutocomplete[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "12")
      .set(this.mapping.searchName, search)
      .set('commune', idCommune);
    if(otherParams) {
      otherParams.forEach((value: string, key: any) => {
        params=params.set(key,value);
      });
    }
      return this.http.get<LocaliteAutocomplete[]>(environment.TERRITOIRE.LOCALITES_API + "/autocomplete-by-commune", {
      observe: "response",
      params,
    }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }

  public autocompletionPublic(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<LocaliteAutocomplete[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "12")
      .set(this.mapping.searchName, search);
    if(otherParams) {
      otherParams.forEach((value: string, key: any) => {
        params=params.set(key,value);
      });
    }
      return this.http.get<LocaliteAutocomplete[]>(environment.PUBLIC.LOCALITE_PUBLIC_API + "/autocomplete", {
      observe: "response",
      params,
    }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }
}
