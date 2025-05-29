import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {Exoneration} from '@sycadApp/models/evaluation/exoneration.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable()
export class ExonerationService extends GenericDatasource<Exoneration, Exoneration, Exoneration>{

  constructor(public http: HttpClient) {super(http); }
  public  getDateFields(): string[] {
    return ["dateDebut","dateFin"];
  }
  getUrl(): string {
    return environment.CONFIGURATION.EXONERATION_API;
  }
}
