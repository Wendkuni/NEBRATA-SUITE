import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {PackageImpot} from '@sycadApp/models/impot/package-impot.model';
import {environment} from '../../../environments/environment';

@Injectable()
export class PackageImpotService extends GenericDatasource<PackageImpot, PackageImpot , PackageImpot>{

  constructor(public http: HttpClient) { super(http);}
  public  getDateFields(): string[] {
    return ["dateDebut","dateFin"];
  }
  getUrl(): string {
    return  environment.CONFIGURATION.PACKAGE_IMPOT_API;
  }

  public deleteElementsImpot(idElementsImpot: number, id: number) {
    return this.http.delete(`${environment.TERRITOIRE.ARRONDISSEMENTS_API}/${idElementsImpot}/element-impot` + "/" + id);
  }
}
