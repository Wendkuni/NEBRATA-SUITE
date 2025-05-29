import { Injectable } from '@angular/core';
import {GenericProcessusDatasource} from '@sycadApp/models/generic-datasource-processus';

import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import { PlanCadastralTourneeDeConservationElement, PlanCadastralTourneeDeConservationItem } from '@sycadApp/models/workflow/cp-tournee-de-conservation.model';

@Injectable()
export class PlanCadastralTournneeDeConservationService extends GenericProcessusDatasource<PlanCadastralTourneeDeConservationItem, PlanCadastralTourneeDeConservationElement>{

  constructor(public http: HttpClient) {
    super(http);
  }
  public  getDateFields(): string[] {
    return ["date","dateCreationDossier","dateModificationDossier","debut","fin","dateExterne","dateMajPlan"];
  }

  getUrl(): string {
    return environment.PROCESSUS.PLAN_CADASTRAL_TOURNEE_DE_CONSERVATION;
  }
}
