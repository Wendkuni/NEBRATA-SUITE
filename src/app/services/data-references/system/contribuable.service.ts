import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {
  ContribuableAutocomplete,
  ContribuableElement,
  ContribuableItem
} from '@sycadApp/models/data-references/contribuables/global.model';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';
import {Injectable} from '@angular/core';
@Injectable()
export class ContribuableService extends GenericDatasource<ContribuableItem, ContribuableElement, ContribuableAutocomplete>{
  constructor(public http: HttpClient) {
    super(http);
  }
  public  getDateFields(): string[] {
    return ["dateDeCreation","createdAt","dateExpiration","dateNaissance","dateObtention"];
  }
  getUrl(): string {
    return environment.USERS.CONTRIBUABLE_AUTOCOMPLETE_API;
  }
}
  