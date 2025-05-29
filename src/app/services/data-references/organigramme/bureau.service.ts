import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {environment} from '../../../../environments/environment';
import { BureauAutocomplete, BureauElement, BureauItem } from '@sycadApp/models/data-references/organigramme/bureau.model';
import { Observable, tap } from 'rxjs';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';


@Injectable()
export class BureauService extends GenericDatasource<BureauItem,BureauElement,BureauAutocomplete> {

  constructor(public  http: HttpClient) {
    super(http);
  }
  getUrl(): string {
    return environment.ORGANIGRAMME.BUREAUX_API;
  }

  public getUrlPublic():string{
    return environment.PUBLIC.BUREAUX_PUBLIC_API;
  };

  public autocompletionPublic(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<BureauAutocomplete[]>> {
  let params = new HttpParams()
    .set(this.mapping.limitName, "12")
    .set(this.mapping.searchName, search);
  if(otherParams) {
    otherParams.forEach((value: string, key: any) => {
      params=params.set(key,value);
    });
  }
    return this.http.get<BureauAutocomplete[]>(environment.PUBLIC.STRUCTURES_PUBLIC_API + "/autocomplete", {
    observe: "response",
    params,
  }).pipe(
    tap((element) => {
      GlobalDateConverter.convertToDate(element,this.getDateFields());
    })
  );
}
}

 