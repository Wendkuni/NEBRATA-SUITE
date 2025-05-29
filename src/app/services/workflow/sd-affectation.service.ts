import { Injectable } from '@angular/core';
import {GenericProcessusDatasource} from '@sycadApp/models/generic-datasource-processus';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import { AffectationParcelle } from '@sycadApp/models/workflow/sd-affectation.model';



@Injectable()
export class SdAffectationService extends GenericProcessusDatasource<AffectationParcelle, AffectationParcelle> {

  constructor(public http: HttpClient) {
    super(http);
  }
  public  getDateFields(): string[] {
    return ["date","dateCreationDossier","dateModificationDossier","debut","fin","dateDoc","dateExterne","dateMajPlan","dateExpiration","dateDeCreation","createdAt","dateObtention","dateDelivrance","dateDoc","dateValidite","dateRetrait"];
  }
  getUrl(): string {
    return environment.SAISIE_DIFFEREE.SAISIE_DIFFEREE_AFFECTATION_API;
  }
}
