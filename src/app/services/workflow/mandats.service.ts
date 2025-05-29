import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GenericProcessusDatasource } from "@sycadApp/models/generic-datasource-processus";
import { MandatElement } from "@sycadApp/models/workflow/common/general";
import { environment } from "environments/environment";
@Injectable()
export class MandatsService extends GenericProcessusDatasource<MandatElement, MandatElement>{
    constructor(public http: HttpClient) {
        super(http);
      }

      public  getDateFields(): string[] {
        return ["date","dateCreationDossier","dateModificationDossier","debut","fin","dateDoc","dateExterne","dateMajPlan","dateExpiration","dateDeCreation","createdAt","dateObtention","dateDelivrance","dateDoc","dateValidite","dateRetrait"];
      }
      getUrl(): string {
        return environment.PROCESSUS.PROCESSUS_MANDAT_API;
      }
}