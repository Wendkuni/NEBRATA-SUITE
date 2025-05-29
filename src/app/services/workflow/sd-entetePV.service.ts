import { Injectable } from '@angular/core';
import {GenericProcessusDatasource} from '@sycadApp/models/generic-datasource-processus';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import { environment } from 'environments/environment';
import { EntetePV } from '@sycadApp/models/workflow/sd-entete-pv.model';
import { Observable } from 'rxjs';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';
import { tap } from 'rxjs/operators';


@Injectable()
export class SdEntetePVService extends GenericProcessusDatasource<EntetePV, EntetePV> {

  constructor(public http: HttpClient) {
    super(http);
  }
  public  getDateFields(): string[] {
    return ["date","dateCreationDossier","dateModificationDossier","debut","fin","dateDoc","dateExterne","datePV","dateExpiration","dateDeCreation","createdAt","dateObtention","dateDelivrance","dateDoc","dateValidite","dateRetrait"];
  }
  getUrl(): string {
    return environment.SAISIE_DIFFEREE.SAISIE_DIFFEREE_PV_ATTRIBUTION_API;
  }

  public autocompletion(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<EntetePV[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "12")
      .set(this.mapping.searchName, search);
      if(otherParams) {
        otherParams.forEach((value: string, key: any) => {
          params=params.set(key,value);
        });
      }

      return this.http.get<EntetePV[]>(this.getUrl() + "/autocomplete", {
      observe: "response",
      params,
    }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }

}


