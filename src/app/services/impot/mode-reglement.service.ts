import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {ModeReglement} from '@sycadApp/models/impot/mode-reglement.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable()
export class ModeReglementService extends GenericDatasource<ModeReglement, ModeReglement, ModeReglement>{

  constructor(public http: HttpClient) {super(http); }
  getUrl(): string {
    return environment.CONFIGURATION.MODE_REGLEMENT_API;
  }
}
