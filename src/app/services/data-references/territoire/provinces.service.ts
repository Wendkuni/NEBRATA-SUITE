import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';
import { ProvinceAutocomplete, ProvinceItem, ProvinceElement } from '@sycadApp/models/data-references/territoire/province.model';

@Injectable()
export class ProvincesService extends GenericDatasource<ProvinceItem,ProvinceElement,ProvinceAutocomplete>{

  constructor(public http: HttpClient) {
    super(http);
  } 
  getUrl(): string {
    return environment.TERRITOIRE.PROVINCES_API;
  }
}
