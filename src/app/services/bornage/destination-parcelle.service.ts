import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {DestinationParcelle} from '@sycadApp/models/bornage/destinationParcelle.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable()
export class DestinationParcelleService extends GenericDatasource<DestinationParcelle, DestinationParcelle, DestinationParcelle>{

  constructor(public http: HttpClient)
  {
    super(http);
  }
  getUrl(): string {
    return environment.CONFIGURATION.DESTINATION_PARCELLE_API;
  }
}
