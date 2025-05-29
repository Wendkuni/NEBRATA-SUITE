import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {BaremeImpot} from '@sycadApp/models/impot/bareme-impot.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable()
export class BaremeImpotService extends GenericDatasource<BaremeImpot, BaremeImpot, BaremeImpot> {

  constructor(public http: HttpClient) { super(http);}

  getUrl(): string {
    return environment.CONFIGURATION.BAREME_IMPOT_API;
  }
}
