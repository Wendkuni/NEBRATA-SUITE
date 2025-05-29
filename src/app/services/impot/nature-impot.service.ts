import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {NatureImpot} from '@sycadApp/models/impot/nature-impot.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable()
export class NatureImpotService extends GenericDatasource<NatureImpot, NatureImpot, NatureImpot> {

  constructor(public  http: HttpClient) {super(http); }
  getUrl(): string {
    return environment.CONFIGURATION.NATURE_IMPOT_API;
  }
}
