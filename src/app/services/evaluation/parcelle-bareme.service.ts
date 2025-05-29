import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {ParcelleBareme} from '@sycadApp/models/cession-parcelle/parcelle-bareme.model';
import {environment} from '../../../environments/environment';

@Injectable()
export class ParcelleBaremeService extends GenericDatasource<ParcelleBareme, ParcelleBareme, ParcelleBareme>{

  constructor(public http: HttpClient) {super(http); }
  getUrl(): string {
    return environment.CONFIGURATION.PARCELLE_BAREME_API;
  }
}
