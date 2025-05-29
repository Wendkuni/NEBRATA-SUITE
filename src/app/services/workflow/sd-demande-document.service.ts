import {Injectable} from '@angular/core';
import {DemandeDocument} from '@sycadApp/models/workflow/sd-demande-document.model';
import {HttpClient} from '@angular/common/http';
import {GenericProcessusDatasource} from '@sycadApp/models/generic-datasource-processus';
import { environment } from 'environments/environment';

@Injectable()
export class SdDemandeDocumentService extends GenericProcessusDatasource<DemandeDocument, DemandeDocument>{
  constructor(public http: HttpClient) {
    super(http);
  }
  public  getDateFields(): string[] {
    return ["date","debut","fin","dateEvaluation","dateDBT","dateCreationDossier","dateModificationDossier","dateDoc","dateExterne","dateMajPlan","debut","fin","dateExpiration","dateDeCreation","createdAt","dateObtention","dateDelivrance","dateDoc","dateValidite","dateRetrait"];
  }
  getUrl(): string {
    return environment.SAISIE_DIFFEREE.SAISIE_DIFFEREE_DEMANDE_DOCUMENT_API;
  }
}



