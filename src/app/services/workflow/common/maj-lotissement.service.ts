import { Injectable } from '@angular/core';
import {GenericProcessusDatasource} from '@sycadApp/models/generic-datasource-processus';
import {
  PlanCadastralMAJLotissementElement
} from '@sycadApp/models/workflow/maj-lotissement.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable()
export class PlanCadastralMiseAjourLotissementService extends GenericProcessusDatasource<PlanCadastralMAJLotissementElement, PlanCadastralMAJLotissementElement>{

  constructor(public http: HttpClient) {super(http); }

  public  getDateFields(): string[] {
    return ["date","dateCreationDossier","dateModificationDossier","dateNaissance","dateDoc","dateRealisation","dateExterne","dateMajPlan","debut","fin","dateExpiration","dateDeCreation","createdAt","dateObtention","dateDelivrance","dateDoc","dateValidite","dateRetrait"];
  }

  getUrl(): string {
    return environment.PROCESSUS.PLAN_CADASTRAL_MAJ_PLAN_CADASTRE;
  }
}
