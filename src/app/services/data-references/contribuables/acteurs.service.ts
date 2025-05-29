import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {ActeurAutocomplete, ActeurElement, ActeurItem} from '@sycadApp/models/data-references/contribuables/acteur.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';


@Injectable()
export class ActeursService extends GenericDatasource<ActeurItem, ActeurElement, ActeurAutocomplete>{

  constructor(public http: HttpClient) {
    super(http);
  }

  getUrl(): string {
    return environment.USERS.ACTEURS_API;
  }

  public  getDateFields(): string[] {
    return ["dateDeCreation","createdAt","dateExpiration","dateObtention"];
  }

}
