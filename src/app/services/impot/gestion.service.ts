import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {Gestion} from '@sycadApp/models/workflow/common/gestion.model';
import {environment} from '../../../environments/environment';

@Injectable()
export class GestionService extends GenericDatasource<Gestion, Gestion, Gestion> {

  constructor(public http: HttpClient) {super(http); }
  getUrl(): string {
    return environment.CONFIGURATION.EXERCICE_FISCALE_API;
  }
}
