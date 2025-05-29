import { Injectable } from '@angular/core';
import {GenericProcessusDatasource} from '@sycadApp/models/generic-datasource-processus';
import {HttpClient} from '@angular/common/http';
import { PlanCadastralFusionementElement, PlanCadastralFusionnementItem } from '@sycadApp/models/workflow/cp-fusionnement.model';
import { environment } from 'environments/environment';
import { DossierBornage } from '@sycadApp/models/bornage/bornage.model';


@Injectable()
export class BornageDelimitationService extends GenericProcessusDatasource<DossierBornage, DossierBornage>{

  constructor(public http: HttpClient) {
    super(http);
  }
  public  getDateFields(): string[] {
    return ["date","dateCreationDossier","dateModificationDossier","dateNaissance","dateDoc","dateRealisation","dateExterne","dateMajPlan","debut","fin","dateExpiration","dateDeCreation","createdAt","dateObtention","dateDelivrance","dateDoc","dateValidite","dateRetrait"];
  }

  getUrl(): string {
    return environment.PROCESSUS.BORNAGE_DELIMITATION;
  }

}
