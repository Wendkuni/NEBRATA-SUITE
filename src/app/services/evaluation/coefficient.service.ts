import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {Coefficient} from '@sycadApp/models/evaluation/coefficient.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable()
export class CoefficientService extends GenericDatasource<Coefficient, Coefficient, Coefficient>{

  constructor(public http: HttpClient) {super(http); }
  getUrl(): string {
    return environment.CONFIGURATION.COEFFICIENT_API;
  }
}
