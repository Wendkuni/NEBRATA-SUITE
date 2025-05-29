import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { GenericDatasource } from "@sycadApp/models/generic-datasource";
import { environment } from "environments/environment";
import { RecoverPass } from "@sycadApp/models/data-references/system/recover-pass";

@Injectable()
export class RecuperationCompteService extends GenericDatasource<
  RecoverPass,
  RecoverPass,
  RecoverPass
> {
  constructor(public http: HttpClient) {
    super(http);
  }
  getUrl(): string {
    return environment.APPLICATION.RECUPERATION_COMPTE;
  }

  public envoyerMailRecuperation(formData: RecoverPass) {
    return this.http.post(`${environment.APPLICATION.RECUPERATION_COMPTE}`, formData);
  }
}
