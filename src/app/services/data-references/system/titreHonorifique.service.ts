import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import {GenericDatasource} from "@sycadApp/models/generic-datasource";
import {
  TitreHonorifiqueAutocomplete,
  TitreHonorifiqueElement, TitreHonorifiqueItem
} from "@sycadApp/models/data-references/contribuables/global.model";

@Injectable()
export class TitreHonorifiqueService extends GenericDatasource<TitreHonorifiqueElement,TitreHonorifiqueAutocomplete,TitreHonorifiqueItem> {

    constructor(public http: HttpClient) {
      super(http)
    }
    getUrl(): string {
        return environment.USERS.TITREHONORIFIQUE_API;
    }
}

