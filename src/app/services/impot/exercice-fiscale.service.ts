import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {ExerciceFiscale} from '@sycadApp/models/impot/exercice-fiscale.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable()
export class ExerciceFiscaleService extends GenericDatasource<ExerciceFiscale, ExerciceFiscale, ExerciceFiscale>{

  constructor(public http: HttpClient) {super(http); }
  getUrl(): string {
    return environment.CONFIGURATION.EXERCICE_FISCALE_API;
  }
  public  getDateFields(): string[] {
    return ["datedebut","datefin"];
  }

  public syncFromSintax() {
    return this.http.head(this.getUrl() + "/sync",{  observe: "response"});
  }
}
