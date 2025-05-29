import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {ExonerationCategorie} from '@sycadApp/models/evaluation/exoneration-categorie.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable()
export class ExonerationCategorieService extends GenericDatasource<ExonerationCategorie, ExonerationCategorie, ExonerationCategorie> {

  constructor(public http: HttpClient) {super(http); }
  getUrl(): string {
    return environment.CONFIGURATION.EXONERATION_CATEGORIE_API;
  }
}
