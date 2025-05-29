import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericDatasource } from '@sycadApp/models/generic-datasource';
import { Mandat } from '@sycadApp/models/workflow/common/general';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class MandatService extends GenericDatasource<Mandat, Mandat, Mandat> {

  constructor(public http: HttpClient) {super(http); }
  getUrl():string {
    return environment.CONFIGURATION.MANDAT_API;
  }
  public  getDateFields(): string[] {
    return ["debut", "fin"];
  }

  public autocompletionByMesMandats(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<Mandat[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "12")
      .set(this.mapping.searchName, search);
    if(otherParams) {
      otherParams.forEach((value: string, key: any) => {
        params=params.set(key,value);
      });
    }
      return this.http.get<Mandat[]>(this.getUrl() + "/autocomplete-by-me", {
      observe: "response",
      params,
    }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }

}
