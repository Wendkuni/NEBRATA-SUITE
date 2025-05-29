import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {HttpClient, HttpResponse, HttpParams} from '@angular/common/http';
import {environment} from 'environments/environment';
import { StatusJuridique } from '@sycadApp/models/data-references/system/model';
import { Observable, tap } from 'rxjs';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';


@Injectable()
export class StatusJuridiqueService  extends GenericDatasource<StatusJuridique,StatusJuridique,StatusJuridique>{

  constructor( public http: HttpClient) {
    super(http);
  }
  getUrl(): string {
    return environment.APPLICATION.STATUS_JURIDIQUE_API;
  }
  public autocompletionPublic(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<StatusJuridique[]>> {
  let params = new HttpParams()
    .set(this.mapping.limitName, "12")
    .set(this.mapping.searchName, search);
  if(otherParams) {
    otherParams.forEach((value: string, key: any) => {
      params=params.set(key,value);
    });
  }
    return this.http.get<StatusJuridique[]>(environment.PUBLIC.STATUS_JURIDIQUE_API + "/autocomplete", {
    observe: "response",
    params,
  }).pipe(
    tap((element) => {
      GlobalDateConverter.convertToDate(element,this.getDateFields());
    })
  );
}
}

