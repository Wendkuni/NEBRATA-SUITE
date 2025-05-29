import { Injectable } from '@angular/core';
import {GenericProcessusDatasource} from '@sycadApp/models/generic-datasource-processus';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import { PlanCadastralFusionementElement } from '@sycadApp/models/workflow/cp-fusionnement.model';

@Injectable()
export class FusionService extends GenericProcessusDatasource<PlanCadastralFusionementElement, PlanCadastralFusionementElement> {

  constructor(public http: HttpClient) {
    super(http);
  }

  public  getDateFields(): string[] {
    return ['date', 'dateCreationDossier', 'dateNaissance', 'dateDoc', 'dateRealisation', 'dateExterne', 'dateMajPlan', 'debut', 'fin', 'dateExpiration', 'dateDeCreation', 'createdAt', 'dateObtention', 'dateDelivrance', 'dateDoc', 'dateValidite', 'dateRetrait'];
  }

  getUrl(): string {
    return environment.PROCESSUS.PLAN_CADASTRAL_FUSION;
  }
}
