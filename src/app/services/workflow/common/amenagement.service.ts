import { Injectable } from '@angular/core';
import {GenericProcessusDatasource} from '@sycadApp/models/generic-datasource-processus';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {
  PlanCadastralAmenagementElement,
  PlanCadastralAmenagementItem
} from '@sycadApp/models/workflow/cp-amenagement.model';

@Injectable()
export class AmenagementService extends GenericProcessusDatasource<PlanCadastralAmenagementItem, PlanCadastralAmenagementElement> {

  constructor(public http: HttpClient) {
    super(http);
  }
  public  getDateFields(): string[] {
    return ["date","dateCreationDossier","dateModificationDossier","debut","fin","dateExterne","dateMajPlan","dateExpiration","dateDelivrance","dateDoc","dateValidite","dateRetrait"];
  }
  getUrl(): string {
    return environment.PROCESSUS.PLAN_CADASTRAL_AMENAGEMENT;
  }
}
