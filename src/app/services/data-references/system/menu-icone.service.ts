
import {GenericDatasource} from '@sycadApp/models/generic-datasource';

import {Injectable} from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { SycadTableContext, MappingAPIParams } from "@sycadApp/libs/model-table";
import { map, catchError, tap } from "rxjs/operators";
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';
import { environment } from 'environments/environment';
import { Icon } from '@sycadApp/features/data-references-domaine/system-ref/menu/model';
@Injectable()
export class MenuIconeService extends GenericDatasource<Icon, Icon, Icon>{
  constructor(public http: HttpClient) {
    super(http);
  }
  getUrl(): string {
    return environment.USERS.MENU_ICONE_API;
  }

  public autocompletion(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<Icon[]>> {
      let params = new HttpParams()
        .set(this.mapping.limitName, "5")
        .set(this.mapping.searchName, search);
      if(otherParams) {
        otherParams.forEach((value: string, key: any) => {
          params=params.set(key,value);
        });
      }
          return this.http.get<Icon[]>(this.getUrl(), {
          observe: "response",
          params,
        }).pipe(
          tap((element) => {
            GlobalDateConverter.convertToDate(element,this.getDateFields());
          })
        );
    }
}
