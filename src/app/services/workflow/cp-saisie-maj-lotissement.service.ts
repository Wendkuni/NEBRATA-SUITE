import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import { Processus } from '@sycadApp/models/workflow/common/general';


@Injectable()
export class CpSaisieDiffereMajPlanService extends GenericDatasource<Processus, Processus, Processus> {

  constructor(public http: HttpClient) {super(http); }
  getUrl(): string {
    return environment.PROCESSUS.PPROCESSUS;
  }
}
