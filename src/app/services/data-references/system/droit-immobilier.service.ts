import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import {
  DroitImmobilier
} from "@sycadApp/models/data-references/system/droit-immobilier.model";


@Injectable()
export class DroitImmobilierService extends GenericDatasource<DroitImmobilier, DroitImmobilier, DroitImmobilier>{

  constructor(public http: HttpClient) {super(http); }
  getUrl(): string {
    return environment.CONFIGURATION.DROIT_IMMOBILIER_API;
  }
}
