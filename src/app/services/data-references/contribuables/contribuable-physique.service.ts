import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';


import { GenericDatasource } from '@sycadApp/models/generic-datasource';
import {ContribuablePhysiqueAutocomplete, ContribuablePhysiqueItem, ContribuablePhysiqueElement} from "@sycadApp/models/data-references/contribuables/contribuable-physique.model";
import {environment} from '../../../../environments/environment';

@Injectable()
export class ContribuablePhysiqueService extends GenericDatasource<ContribuablePhysiqueItem, ContribuablePhysiqueElement, ContribuablePhysiqueAutocomplete> {

    constructor(public http: HttpClient) {
        super(http);
    }

    public  getDateFields(): string[] {
        return ["dateNaissance","createdAt","dateExpiration","dateObtention"];
      }
    getUrl(): string {
        return environment.USERS.CONTRIBUABLE_PHYSIQUE_API;
    }
    getAvatar(avatarCode) {
        return this.http.get(this.getUrl() + "/icon/" + avatarCode, { responseType: 'blob' });
    }

    searchUsername(guid: string, username: string) {
        return this.http.get<boolean>(`${environment.USERS.CONTRIBUABLE_CHECK_API}/username/${guid}/${username}`);
    }




}

