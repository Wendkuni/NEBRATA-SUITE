import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { environment } from 'environments/environment';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import { StructureAutocomplete, StructureElement, StructureItem } from '@sycadApp/models/data-references/organigramme/structure.model';
import { Observable, tap } from 'rxjs';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';



@Injectable()
export class StructureService extends GenericDatasource<StructureItem, StructureElement, StructureAutocomplete>{

  constructor(public http: HttpClient) {
    super(http);
  }
  public getUrl():string{
    return environment.ORGANIGRAMME.STRUCTURES_API;
  };

  public getUrlPublic():string{
    return environment.PUBLIC.STRUCTURES_PUBLIC_API;
  };

  public autocompletionPublic(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<StructureAutocomplete[]>> {
  let params = new HttpParams()
    .set(this.mapping.limitName, "12")
    .set(this.mapping.searchName, search);
  if(otherParams) {
    otherParams.forEach((value: string, key: any) => {
      params=params.set(key,value);
    });
  }
    return this.http.get<StructureAutocomplete[]>(environment.PUBLIC.STRUCTURES_PUBLIC_API + "/autocomplete", {
    observe: "response",
    params,
  }).pipe(
    tap((element) => {
      GlobalDateConverter.convertToDate(element,this.getDateFields());
    })
  );
}
}
