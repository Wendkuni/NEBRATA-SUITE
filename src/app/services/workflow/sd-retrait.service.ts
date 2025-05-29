import { Injectable } from '@angular/core';
import {GenericProcessusDatasource} from '@sycadApp/models/generic-datasource-processus';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import { RetraitParcelle } from '@sycadApp/models/workflow/sd-retrait.model';



@Injectable()
export class SdRetraitService extends GenericProcessusDatasource<RetraitParcelle, RetraitParcelle> {

  constructor(public http: HttpClient) {
    super(http);
  }
  public  getDateFields(): string[] {
    return ["date","dateCreationDossier","dateModificationDossier","dateExterne","debut","fin","dateMajPlan","dateExpiration","dateDeCreation","createdAt","dateObtention","dateDelivrance","dateDoc","dateValidite","dateRetrait"];
  }
  getUrl(): string {
    return environment.SAISIE_DIFFEREE.SAISIE_DIFFEREE_RETRAIT_API;
  }
}
