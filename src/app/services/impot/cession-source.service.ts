import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';
import { CessionSource } from '@sycadApp/models/workflow/common/attribution-source.model';

@Injectable()
export class CessionSourceService extends GenericDatasource<CessionSource, CessionSource, CessionSource>{

  constructor(public http: HttpClient) {super(http); }
  getUrl(): string {
    return environment.CONFIGURATION.ATTRIBUTION_SOURCE_API;
  }
}
