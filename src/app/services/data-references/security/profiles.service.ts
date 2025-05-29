import { RoleItem } from '@sycadApp/models/data-references/security/role.model';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {
  ProfilAutocomplete,
  ProfilElement,
  ProfilItem
} from '@sycadApp/models/data-references/security/profil.model';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import { environment } from 'environments/environment';


@Injectable()
export class ProfilesService extends GenericDatasource <ProfilItem, ProfilElement, ProfilAutocomplete> {

  roles: RoleItem[] = [];
  constructor(public http: HttpClient) { super(http)}
  getUrl(): string {
    return environment.SECURITY.PROFILES_API;
  }

}
