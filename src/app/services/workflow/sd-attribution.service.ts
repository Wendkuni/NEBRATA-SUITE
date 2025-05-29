import { Injectable } from '@angular/core';
import {GenericProcessusDatasource} from '@sycadApp/models/generic-datasource-processus';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import { AttributionParcelle } from '@sycadApp/models/workflow/sd-attribution.model';
import {tap} from "rxjs/operators";
import {
  GlobalDateConverter
} from "@sycadShared/global-date-converter";



@Injectable()
export class SdAttributionService extends GenericProcessusDatasource<AttributionParcelle, AttributionParcelle> {

  constructor(public http: HttpClient) {
    super(http);
  }
  public  getDateFields(): string[] {
    return ["date","dateCreationDossier","dateObtention","dateModificationDossier","debut","fin","dateExterne","dateMajPlan","dateExpiration","dateDeCreation","createdAt","dateObtention","dateDelivrance","dateDoc","dateValidite","dateRetrait","delaiDeMiseEnValeur"];
  }
  getUrl(): string {
    return environment.SAISIE_DIFFEREE.SAISIE_DIFFEREE_ATTRIBUTION_API;
  }
  public getAttributionByIcad(icad: string) {
    return this.http.get<any>(this.getUrl() + "/parcelle/" + icad).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }
}
