import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {Processus} from '@sycadApp/models/workflow/common/general';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class CpTourneeDeConservationService extends GenericDatasource<Processus, Processus, Processus> {

  constructor(public http: HttpClient) { super(http);}
  getUrl(): string {
    return environment.PROCESSUS.PPROCESSUS;
  }
}
