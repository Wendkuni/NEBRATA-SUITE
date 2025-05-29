import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Civilite } from '@sycadApp/models/data-references/system/model';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import { Observable, tap } from 'rxjs';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';


@Injectable()
export class CiviliteService extends GenericDatasource<Civilite,Civilite,Civilite> {

  constructor(public http:HttpClient) {
    super(http);
  }
  public getUrl():string{
    return environment.APPLICATION.CIVILITES_API;
  };

  public autocompletionPublic(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<Civilite[]>> {
  let params = new HttpParams()
    .set(this.mapping.limitName, "12")
    .set(this.mapping.searchName, search);
  if(otherParams) {
    otherParams.forEach((value: string, key: any) => {
      params=params.set(key,value);
    });
  }
    return this.http.get<Civilite[]>(environment.PUBLIC.CIVILITES_PUBLIC_API + "/autocomplete", {
    observe: "response",
    params,
  }).pipe(
    tap((element) => {
      GlobalDateConverter.convertToDate(element,this.getDateFields());
    })
  );
}
}

