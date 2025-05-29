import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { GenericProcessusDatasource } from '@sycadApp/models/generic-datasource-processus';
import { PlanCadastralSectionnementElement, PlanCadastralSectionnementItem } from '@sycadApp/models/workflow/common/sectionnement.model';



@Injectable(
)
export class PlanCadastralSectionnementService extends GenericProcessusDatasource<PlanCadastralSectionnementItem, PlanCadastralSectionnementElement>  {


    constructor(public http:HttpClient) {
      super(http);
      }

      public  getDateFields(): string[] {
        return ["date","dateCreationDossier","dateModificationDossier","debut","fin","dateExterne","dateMajPlan","dateExpiration","dateDelivrance","dateDoc","dateValidite","dateRetrait"];
      }
      getUrl(): string {
        return environment.PROCESSUS.PLAN_CADASTRAL_SECTIONNEMENT;
      }


}
