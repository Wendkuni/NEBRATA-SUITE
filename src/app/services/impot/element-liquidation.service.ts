import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {ElementLiquidation} from '@sycadApp/models/impot/element-liquidation.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable()
export class ElementLiquidationService extends  GenericDatasource<ElementLiquidation, ElementLiquidation, ElementLiquidation>{

  constructor(public http: HttpClient) {super(http); }
  getUrl(): string {
    return environment.CONFIGURATION.ELEMENT_LIQUIDATION_API;
  }
}
