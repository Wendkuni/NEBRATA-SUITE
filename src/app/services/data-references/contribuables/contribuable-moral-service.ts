import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import { GenericDatasource } from '@sycadApp/models/generic-datasource';
import {
  ContribuableMoraleAutocomplete,
  ContribuableMoraleElement, ContribuableMoraleItem,
} from "@sycadApp/models/data-references/contribuables/contribuable-moral.model";


@Injectable()
export class ContribuableMoralService extends GenericDatasource<ContribuableMoraleItem, ContribuableMoraleElement, ContribuableMoraleAutocomplete> {

    constructor(public http: HttpClient) {
        super(http);
    }
    public  getDateFields(): string[] {
      return ["dateDeCreation","createdAt","dateExpiration","dateObtention"];
    }
    getUrl(): string {
        return environment.USERS.CONTRIBUABLE_MORAL_API;
    }

}

