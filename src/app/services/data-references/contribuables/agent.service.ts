import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';



import { GenericDatasource } from '@sycadApp/models/generic-datasource';

import {environment} from '../../../../environments/environment';
import { AgentAutocomplete, AgentElement, AgentItem } from '@sycadApp/models/data-references/contribuables/agent.model';


@Injectable()
export class AgentsService extends GenericDatasource<AgentItem, AgentElement, AgentAutocomplete> {

  constructor(public http: HttpClient) {
    super(http);
  }

  public  getDateFields(): string[] {
    return ["dateNaissance","createdAt","dateExpiration","dateObtention"];
  }
  getUrl(): string {
    return environment.USERS.AGENTS_API;
  }

  searchUsername(guid: string, username: string) {
    return this.http.get<boolean>(`${environment.USERS.CONTRIBUABLE_CHECK_API}/username/${guid}/${username}`);
  }




}

