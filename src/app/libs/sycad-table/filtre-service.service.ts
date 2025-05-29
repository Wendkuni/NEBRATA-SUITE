import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { FiltreRecherche } from '../model-table';
import { GenericDatasourceMock } from '@sycadApp/models/generic-datasource.mock';


@Injectable()
export class FiltreRechercheAvanceService extends GenericDatasourceMock<FiltreRecherche> {

  constructor(public http:HttpClient) { 
    super(http);
  }
  public getUrl():string{
    return environment.APPLICATION.FILTRE_RECHERCHE_AVANCE_API;
  };
}
