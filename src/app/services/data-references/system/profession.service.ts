import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import {GenericDatasource} from "@sycadApp/models/generic-datasource";
import {ProfessionAutocomplete, ProfessionElement, ProfessionItem
} from "@sycadApp/models/data-references/contribuables/global.model";
import { Observable } from 'rxjs';
import { map, catchError, tap } from "rxjs/operators";
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';


@Injectable()
export class ProfessionService extends GenericDatasource<ProfessionElement,ProfessionItem,ProfessionAutocomplete> {
  url = environment.PUBLIC.PROFESSION_PUBLIC_API + '/autocomplete';

  constructor(public http: HttpClient) {
    super(http)
  }
  getUrl(): string {
    return environment.USERS.PROFESSION_API;
  }

  public autocompletionPublic(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<ProfessionAutocomplete[]>> {
  let params = new HttpParams()
    .set(this.mapping.limitName, "12")
    .set(this.mapping.searchName, search);
  if(otherParams) {
    otherParams.forEach((value: string, key: any) => {
      params=params.set(key,value);
    });
  }
    return this.http.get<ProfessionAutocomplete[]>(environment.PUBLIC.PROFESSION_PUBLIC_API + "/autocomplete", {
    observe: "response",
    params,
  }).pipe(
    tap((element) => {
      GlobalDateConverter.convertToDate(element,this.getDateFields());
    })
  );
}

}


