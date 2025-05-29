import { Injectable } from '@angular/core';
import {GenericProcessusDatasource} from '@sycadApp/models/generic-datasource-processus';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import { MutationParcelle } from '@sycadApp/models/workflow/sd-mutation.model';




@Injectable()
export class SdMutationService extends GenericProcessusDatasource<MutationParcelle, MutationParcelle> {

  constructor(public http: HttpClient) {
    super(http);
  }
  public  getDateFields(): string[] {
    return ["date","dateCreationDossier","dateModificationDossier","debut","fin","dateExterne","dateMajPlan","dateExpiration","dateQuittance","enregistrement","dateDeCreation","createdAt","dateObtention","dateDelivrance","dateDoc","dateValidite","dateRetrait"];
  }
  getUrl(): string {
    return environment.SAISIE_DIFFEREE.SAISIE_DIFFEREE_MUTATION_API;
  }
}
