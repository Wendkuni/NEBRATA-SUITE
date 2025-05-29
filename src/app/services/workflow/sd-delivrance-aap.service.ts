import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GenericProcessusDatasource} from '@sycadApp/models/generic-datasource-processus';
import { environment } from 'environments/environment';
import { DelivranceAap } from '@sycadApp/models/workflow/sd-delivrance-aap.model';

@Injectable()
export class SdDelivranceAapService extends GenericProcessusDatasource<DelivranceAap, DelivranceAap>{
  constructor(public http: HttpClient) {
    super(http);
  }
  getUrl(): string {
    return environment.SAISIE_DIFFEREE.SAISIE_DIFFEREE_DELIVRANCE_AAP_API;
  }
  public getDateFields(): string[] {
    return ["date","dateCreationDossier","dateModificationDossier","debut","fin","dateDoc","dateExterne","dateExpiration","dateDeCreation","createdAt","dateObtention","dateDelivrance","dateDoc","dateValidite","dateRetrait", "dateAttribution", "delaiDeMiseEnValeur", "dateDepot", "dateDemande"];
  }
}





