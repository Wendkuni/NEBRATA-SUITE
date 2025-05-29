import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import {
  DroitImmobilier
} from "@sycadApp/models/data-references/system/droit-immobilier.model";
import {
  DomaineFonctionnel
} from "@sycadApp/models/data-references/system/domaine-fonctionnel.model";


@Injectable()
export class DomaineFonctionnelService extends GenericDatasource<DomaineFonctionnel, DomaineFonctionnel, DomaineFonctionnel>{

  constructor(public http: HttpClient) {super(http); }
  getUrl(): string {
    return environment.CONFIGURATION.DOMAINE_FONCTIONNEL_API;
  }
}
