import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import { LivreFoncier} from '@sycadApp/models/data-references/contribuables/global.model';

@Injectable()
export class LivreFoncierService extends GenericDatasource<LivreFoncier, LivreFoncier, LivreFoncier> {

  constructor(public http: HttpClient) {
    super(http);
  }

  public getUrl():string{
    return environment.ORGANIGRAMME.LIVRE_FONCIER_API
  };

}

