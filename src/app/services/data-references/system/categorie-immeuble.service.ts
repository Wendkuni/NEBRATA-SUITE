import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {CategorieImmeuble} from '@sycadApp/models/data-references/system/categorie-immeuble.model';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';


@Injectable()
export class CategorieImmeubleService extends GenericDatasource<CategorieImmeuble, CategorieImmeuble, CategorieImmeuble>{

  constructor(public http: HttpClient) {super(http); }
  getUrl(): string {
    return environment.CONFIGURATION.CATEGORIE_IMMEUBLE_API;
  }
}
