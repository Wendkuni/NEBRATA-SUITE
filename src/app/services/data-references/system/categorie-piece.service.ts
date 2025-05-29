import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {CategoriePiece} from '@sycadApp/models/data-references/contribuables/global.model';
import { Observable } from 'rxjs';

@Injectable()
export class CategoriePieceService extends GenericDatasource<CategoriePiece, CategoriePiece, CategoriePiece> {

  constructor(public http: HttpClient) {
    super(http);
  }
  public getUrl():string{
    return environment.APPLICATION.CATEGORIES_PIECE;
  };



  public autocompletionWithFilter(search: string, type: string, isIdentite: boolean = false): Observable<HttpResponse<CategoriePiece[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "5")
      .set("filter", type)
      .set("isIdentite", isIdentite)
      .set(this.mapping.searchName, search);
    return this.http.get<CategoriePiece[]>(this.getUrlPublic() + "/autocomplete", {
      observe: "response",
      params,
    });
  }

  public getUrlPublic():string{
    return environment.PUBLIC.CATEGORIES_PUBLIC_PIECE;
  };



  public autocompletionPublicWithFilter(search: string, type: string): Observable<HttpResponse<CategoriePiece[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "5")
      .set("filter", type)
      .set(this.mapping.searchName, search);
    return this.http.get<CategoriePiece[]>(this.getUrlPublic() + "/autocomplete", {
      observe: "response",
      params,
    });
  }
}

