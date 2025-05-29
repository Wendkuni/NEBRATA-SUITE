import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import { environment } from 'environments/environment';
import { CommuneElement, CommuneItem, CommuneAutocomplete } from '@sycadApp/models/data-references/territoire/commune.model';
import { Observable } from 'rxjs';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';
import { tap } from 'rxjs/operators';


@Injectable()
export class CommunesService extends GenericDatasource<CommuneItem,CommuneElement,CommuneAutocomplete> {

  constructor(public  http: HttpClient) {
    super(http);
  }
  getUrl(): string {
    return environment.TERRITOIRE.COMMUNES_API;
  }


  public autocompletionByZoneCompetences(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<CommuneAutocomplete[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "12")
      .set(this.mapping.searchName, search);
      otherParams.forEach((value: string, key: any) => {
          params=params.set(key,value);
      });

      return this.http.get<CommuneAutocomplete[]>(this.getUrl() + "/autocomplete-by-zone-competence", {
      observe: "response",
      params,
    }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }

  public autocompletionPublic(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<CommuneAutocomplete[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "12")
      .set(this.mapping.searchName, search);
      otherParams.forEach((value: string, key: any) => {
          params=params.set(key,value);
      });

      return this.http.get<CommuneAutocomplete[]>(this.getUrl() + "/public/autocomplete", {
      observe: "response",
      params,
    }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }

  autocompleteByZoneCompetenceCommuneAgent():Observable<any>{
    return this.http.get<any>(this.getUrl() + "/autocomplete-by-zone-competence-commune-agent");
  }
}
