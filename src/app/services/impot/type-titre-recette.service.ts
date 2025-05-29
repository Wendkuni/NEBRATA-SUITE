import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {TypeTitreRecette} from '@sycadApp/models/impot/type-titre-recette.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable()
export class TypeTitreRecetteService extends GenericDatasource<TypeTitreRecette, TypeTitreRecette, TypeTitreRecette>{

  constructor(public http: HttpClient) {super(http); }
  getUrl(): string {
    return environment.CONFIGURATION.TYPE_TITRE_RECETTE_API;
  }
}
