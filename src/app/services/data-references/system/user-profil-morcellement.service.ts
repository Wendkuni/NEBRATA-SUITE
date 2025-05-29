import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { UserDossierInfo } from '@sycadApp/models/data-references/system/user-dossier.model';
import { Observable, tap } from 'rxjs';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';



@Injectable()
export class UserProfilMorcellementService {


    urlMoi = environment.USERS.USER_PROFIL_DOSSIER_MOI_MORCELLEMENT;
    urlCheck = environment.USERS.USER_PROFIL_DOSSIER_CONTRIBUABLE_MORCELLEMENT;
   constructor(public http: HttpClient) {
   }

   getUrl(guid: string){
  return (guid)?`${this.urlCheck}/${guid}`:this.urlMoi;
   }

    getAll(guid: string): Observable<UserDossierInfo[]>{
      return this.http.get<UserDossierInfo[]>(this.getUrl(guid)).pipe(
        tap((element) => {
          GlobalDateConverter.convertToDate(element,this.getDateFields());
        })
      );
  }

  public  getDateFields(): string[] {
    return ["date","dateCreationDossier","dateModificationDossier","debut","fin","dateExterne","dateMajPlan","dateExpiration","dateDelivrance","dateDoc","dateValidite","dateRetrait"];
  }
}
