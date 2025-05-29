import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {BaremeImpot} from '@sycadApp/models/impot/bareme-impot.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import { CalendrierFiscale } from '@sycadApp/models/impot/calendrier-fiscale.model';

@Injectable()
export class CalendrierFiscaleService extends GenericDatasource<CalendrierFiscale, CalendrierFiscale, CalendrierFiscale> {

  constructor(public http: HttpClient) { super(http);}

  public  getDateFields(): string[] {
    return ["date","dateButoir","dateTitre","datefin","datedebut","dateCreationDossier","dateModificationDossier","dateNaissance","dateDoc","dateRealisation","dateExterne","dateMajPlan","debut","fin","dateExpiration","dateDeCreation","createdAt","dateObtention","dateDelivrance","dateDoc","dateValidite","dateRetrait"];
  }

  getUrl(): string {

    return environment.CONFIGURATION.CALENDRIER_FISCALE_API;
    
  }

  public syncFromSintax() {
    return this.http.head(this.getUrl() + "/sync",{  observe: "response"});
  }
}