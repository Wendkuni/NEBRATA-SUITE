import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import {
  MotifRejet
} from "@sycadApp/models/data-references/system/motif-rejet.model";


@Injectable()
export class MotifRejetService extends GenericDatasource<MotifRejet, MotifRejet, MotifRejet>{

  constructor(public http: HttpClient) {super(http); }
  getUrl(): string {
    return environment.CONFIGURATION.MOTIF_REJET_API;
  }
}
