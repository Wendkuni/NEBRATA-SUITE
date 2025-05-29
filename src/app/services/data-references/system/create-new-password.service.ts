import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { GenericDatasource } from "@sycadApp/models/generic-datasource";
import { RecoverPass } from "@sycadApp/models/data-references/system/recover-pass";
import { environment } from 'environments/environment';

@Injectable()
export class CreateNewPasswordService  {
  constructor(public http: HttpClient) {
  }
  getUrl(): string {
    return environment.APPLICATION.RECUPERATION_COMPTE;
  }

  public updatePassword(code: string, formData: RecoverPass) {
    return this.http.patch(`${environment.APPLICATION.RECUPERATION_COMPTE}/${code}`, formData);
  }
  public checkUser(code: string) {
    return this.http.get(`${environment.APPLICATION.RECUPERATION_COMPTE}/${code}`,{observe: 'response'});
  }
}
  