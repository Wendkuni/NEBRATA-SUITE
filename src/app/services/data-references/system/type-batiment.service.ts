import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {TypeBatiment} from '@sycadApp/models/data-references/system/type-batiment.model';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class TypeBatimentService extends  GenericDatasource<TypeBatiment, TypeBatiment, TypeBatiment>{

  constructor(public http: HttpClient) {super(http) ;}
  getUrl(): string {
    return environment.CONFIGURATION.TYPE_BATIMENT_API;
  }
}
