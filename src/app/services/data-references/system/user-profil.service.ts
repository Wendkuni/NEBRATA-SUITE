import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {EmailForm} from '@sycadApp/models/data-references/security/user-profil.model';
import {Adresse, Contact} from '@sycadApp/models/data-references/system/model';
import { environment } from 'environments/environment';


export class AvatarEditionFormData {
  codeDownload: string;
  constructor(value:string) {
    this.codeDownload=value;
  }
}


@Injectable()
export class UserProfilService {
  avaturl = environment.USERS.USER_PROFIL_EDITION_AVATAR;
  emailUrl= environment.USERS.USER_PROFIL_EDITION_EMAIL;
  adresseUrl= environment.USERS.USER_PROFIL_EDITION_ADRESSE;
  telephoneUrl= environment.USERS.USER_PROFIL_EDITION_TELEPHONE;
  credentialUrl= environment.USERS.USER_PROFIL_EDITION_CREDENTIAL;

  constructor(public http: HttpClient) {
  }

  public updateAvatar(codeDownload: AvatarEditionFormData){
    return this.http.patch<{avatar:string}>(this.avaturl, codeDownload);
  }

  public updateEmail(email: Contact[]) {
      return this.http.patch(this.emailUrl, email);
  }
  public updateAdresse(adresse: Adresse[]) {
    return this.http.patch(this.adresseUrl, adresse);
  }
  public updateCredential(credential: Credential) {
    return this.http.patch(this.credentialUrl, credential);
  }
  public updateTelephone(telephone: Contact[]) {
    return this.http.patch(this.telephoneUrl, telephone);
  }

  public deleteEmail(emailId:number) {
    return this.http.delete(this.emailUrl+'/' + emailId);
  }
  public deleteAdresse(adresseId:number) {
    return this.http.delete(this.adresseUrl+'/'+ adresseId);
  }
  public deleteTelephone(telephoneId:number) {
    return this.http.delete(this.telephoneUrl+'/'+ telephoneId);
  }
}
