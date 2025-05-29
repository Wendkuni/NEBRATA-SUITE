import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {TypeImmeuble} from '@sycadApp/models/bornage/type-immeuble.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable()
export class TypeImmeubleService extends GenericDatasource<TypeImmeuble, TypeImmeuble, TypeImmeuble>{

  constructor(public http: HttpClient)
  {
    super(http);
  }
  getUrl(): string {
    return environment.CONFIGURATION.TYPE_IMMEUBLE_API;
  }
  public deleteCategories(idImmeubleType: number, id: number) {
    return this.http.delete(`${environment.CONFIGURATION.TYPE_IMMEUBLE_API}/${idImmeubleType}/categorie-immeuble` + "/" + id);
  }
  public deleteCoefVecrs(idImmeubleType: number, id: number) {
    return this.http.delete(`${environment.CONFIGURATION.TYPE_IMMEUBLE_API}/${idImmeubleType}/coefficient-vetus` + "/" + id);
  }
}
