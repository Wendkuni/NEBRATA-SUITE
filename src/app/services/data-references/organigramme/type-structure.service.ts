import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import { TypeStructure } from '@sycadApp/models/data-references/organigramme/type-structure.model';

@Injectable()
export class TypeStructureService  extends GenericDatasource<TypeStructure,TypeStructure,TypeStructure>{

  constructor( public http: HttpClient) {
    super(http);
  }
  getUrl(): string {
    return environment.ORGANIGRAMME.CATEGORIES_STRUCTURE_API;
  }
}
