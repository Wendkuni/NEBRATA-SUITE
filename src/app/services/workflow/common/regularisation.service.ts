import { Injectable } from '@angular/core';
import {GenericProcessusDatasource} from '@sycadApp/models/generic-datasource-processus';
import {
  PlanCadastralMAJLotissementElement
} from '@sycadApp/models/workflow/maj-lotissement.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import { PlanCadastralRegularisationElement } from '@sycadApp/models/workflow/regularisation.model';

@Injectable()
export class SdMajService extends GenericProcessusDatasource<PlanCadastralRegularisationElement, PlanCadastralRegularisationElement>{

  constructor(public http: HttpClient) {super(http); }

  public  getDateFields(): string[] {
    return ["date","dateCreationDossier","dateModificationDossier","dateNaissance","dateDoc","dateRealisation","dateExterne","dateMajPlan","debut","fin","dateExpiration","dateDeCreation","createdAt","dateObtention","dateDelivrance","dateDoc","dateValidite","dateRetrait"];
  }

  getUrl(): string {
    return environment.SAISIE_DIFFEREE.SAISIE_DIFFEREE_MAJ_API;
  }
}
