import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import {environment} from '../../../../environments/environment';
import { GenericDatasource } from "@sycadApp/models/generic-datasource";
import {
  IndivisionItem,
  IndivisionElement,
  IndivisionAutocomplete,
} from "@sycadApp/models/data-references/contribuables/indivisions.model";
import { Observable} from "rxjs";


@Injectable()
export class IndivisionsService extends GenericDatasource<
  IndivisionItem,
  IndivisionElement,
  IndivisionAutocomplete
> {
  constructor(public http: HttpClient) {
    super(http);
  }
  public getUrl(): string {
    return environment.USERS.INDIVISIONS_API;
  }

  public  getDateFields(): string[] {
    return ["dateDeCreation","createdAt","dateExpiration","dateObtention"];
  }

  public updateMembresIndivision(id: string, ressource: any) {
    return this.http.patch(
      `${environment.USERS.INDIVISIONS_API}/${id}/indivision-membres`,
      ressource
    );
  }

  public deleteMembresIndivision(guid: string, id: number) {
    return this.http.delete(`${environment.USERS.INDIVISIONS_API}/${guid}/indivision-membres` + "/" + id);
  }

  public getIndivisionRelation(id: number): Observable<any> {
    return this.http.get(`${environment.APPLICATION.INDIVISIONS_REALATION_API}` + "/" + id);
  }



  searchUsername(guid: string, username: string){
    return this.http.get(`${environment.USERS.CONTRIBUABLE_CHECK_API}/username/${guid}/${username}`);
  }



  public searchMmebreIndivision(search: string): Observable<HttpResponse<any[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "5")
      .set(this.mapping.searchName, search);
    return this.http.get<any[]>(`${environment.USERS.CONTRIBUABLE_AUTOCOMPLETE_MEMBRE_INDIVISION_API}`, {
      observe: "response",
      params,
    });
  }


}
