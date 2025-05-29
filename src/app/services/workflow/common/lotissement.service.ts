import { Injectable } from '@angular/core';
import {GenericProcessusDatasource} from '@sycadApp/models/generic-datasource-processus';
import {
  PlanCadastralLotissementElement,
  PlanCadastralLotissementItem
} from '@sycadApp/models/workflow/cp-lotissement.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable()
export class LotissementService extends GenericProcessusDatasource<PlanCadastralLotissementItem, PlanCadastralLotissementElement> {

  constructor(public http: HttpClient) {
    super(http);
  }
  public  getDateFields(): string[] {
    return ["date","dateCreationDossier","dateModificationDossier","debut","fin","dateExterne","dateMajPlan","dateExpiration","dateDelivrance","dateDoc","dateValidite","dateRetrait"];
  }
  getUrl(): string {
    return environment.PROCESSUS.PLAN_CADASTRAL_LOTISSEMENT;
  }
}
