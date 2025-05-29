import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {DegreSuccessoral} from '@sycadApp/models/evaluation/degre-successoral.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable()
export class DegreSuccessoralService extends GenericDatasource<DegreSuccessoral, DegreSuccessoral, DegreSuccessoral> {

  constructor(public http: HttpClient) {super(http); }


  getUrl(): string {
    return environment.CONFIGURATION.DEGRE_SUCCESSORAL_API;
  }
}
