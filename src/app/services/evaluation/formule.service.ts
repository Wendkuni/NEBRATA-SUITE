import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {Formule} from '@sycadApp/models/evaluation/formule.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable()
export class FormuleService extends GenericDatasource<Formule, Formule, Formule> {

  constructor(public http: HttpClient) {super(http); }
  getUrl(): string {
    return environment.CONFIGURATION.FORMULE_API;
  }
}
