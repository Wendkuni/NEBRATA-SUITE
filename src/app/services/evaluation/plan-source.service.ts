import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {PlanSource} from '@sycadApp/models/evaluation/plan-source.model';
import {environment} from '../../../environments/environment';

@Injectable()
export class PlanSourceService extends  GenericDatasource<PlanSource, PlanSource, PlanSource>{
  constructor(public http: HttpClient) { super(http);}
  getUrl(): string {
    return environment.CONFIGURATION.PLAN_SOURCE_API;
  }
}
