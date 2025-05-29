import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {CategoriePieceProcessus} from '@sycadApp/models/workflow/common/general';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
  

@Injectable({
  providedIn: 'root'
})
export class CategoriePieceProcessusService  extends GenericDatasource<CategoriePieceProcessus, CategoriePieceProcessus, CategoriePieceProcessus>{

  constructor(public http: HttpClient) {super(http); }
  getUrl(): string {
    return environment.CONFIGURATION.CATEGORIE_PIECE_PROCESSUS_API;
  }
}
