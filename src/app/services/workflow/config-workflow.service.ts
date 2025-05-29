import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Processus} from "@sycadApp/models/workflow/common/general";
import {GenericDatasource} from "@sycadApp/models/generic-datasource";

@Injectable({
  providedIn: 'root'
})
export class ConfigWorkflowService extends GenericDatasource<Processus, Processus, Processus> {

  constructor(public http: HttpClient) {
    super(http);
  }
  public getUrl():string{
    return environment.PROCESSUS.PPROCESSUS;
  };

}
