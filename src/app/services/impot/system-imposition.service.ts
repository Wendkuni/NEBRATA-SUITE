import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {SystemImposition} from '@sycadApp/models/impot/system-imposition.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable()
export class SystemImpositionService extends GenericDatasource<SystemImposition, SystemImposition, SystemImposition>{

  constructor(public http: HttpClient) {super(http); }
  getUrl(): string {
    return environment.CONFIGURATION.SYSTEM_IMPOSITION_API;
  }
}
