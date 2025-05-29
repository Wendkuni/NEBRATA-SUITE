import { Injectable } from '@angular/core';
import {GenericProcessusDatasource} from '@sycadApp/models/generic-datasource-processus';
import {
  PlanCadastralMorcellementElement
} from '@sycadApp/models/workflow/cp-morcellement.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable()
export class PlanCadastralMorcellementService extends GenericProcessusDatasource<PlanCadastralMorcellementElement, PlanCadastralMorcellementElement>{

  constructor(public http: HttpClient) {super(http); }

  public  getDateFields(): string[] {
    return ["date","dateCreationDossier","dateModificationDossier","dateNaissance","dateDoc","dateRealisation","dateExterne","dateMajPlan","debut","fin","dateExpiration","dateDeCreation","createdAt","dateObtention","dateDelivrance","dateDoc","dateValidite","dateRetrait"];
  }
  getUrl(): string {
    return environment.PROCESSUS.PLAN_CADASTRAL_MORCELLEMENT;
  }
}
