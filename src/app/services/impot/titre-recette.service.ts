import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {TitreRecette} from '@sycadApp/models/impot/mode-reglement.model';
import {environment} from '../../../environments/environment';

@Injectable()
export class TitreRecetteService extends GenericDatasource<TitreRecette, TitreRecette, TitreRecette> {

  constructor(public http: HttpClient) { super(http);}

  getUrl(): string {
    return environment.CONFIGURATION.TITRE_RECETTE_API;
  }
}
