import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import {
  TypeTransition
} from "@sycadApp/models/data-references/system/type-transition.model";


@Injectable()
export class TypeTransitionService extends GenericDatasource<TypeTransition, TypeTransition, TypeTransition>{

  constructor(public http: HttpClient) {super(http); }
  getUrl(): string {
    return environment.CONFIGURATION.TYPE_TRANSITION_API;
  }
}
