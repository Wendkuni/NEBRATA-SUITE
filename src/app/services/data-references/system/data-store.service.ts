import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {environment} from 'environments/environment';
import { Parametre } from '@sycadApp/models/data-references/system/model';



@Injectable()
export class DataStoreService extends GenericDatasource<Parametre,Parametre,Parametre> {

  constructor(public  http: HttpClient) {
    super(http);
  }
  getUrl(): string {
    return environment.APPLICATION.PARAMETRES_API;
  }
}
