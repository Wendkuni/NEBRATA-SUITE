import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { GeneralContribuable } from '@sycadApp/models/data-references/contribuables/global.model';

import { Observable, of, tap } from "rxjs";
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';



@Injectable({ providedIn: 'root' })
export class IFUApiService {
  constructor(public http: HttpClient) {
  }

checkIfContribuableExist(codeUnique: string,type: string,typeContribuable: string) {
    return this.http.get<GeneralContribuable>(`${environment.USERS.IFU_API}/${codeUnique}/${type}/${typeContribuable}`,{ observe: "response" }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,["dateNaissance","createdAt","dateExpiration","dateObtention"]);
      })
    );
  }


  public importerContribuable(codeUnique: string,typeIdentifiant:string,typeContribuable:string, donneesComplementaires: any) {
    return this.http.post(`${environment.USERS.IFU_API}/import/contribuable`, {
        codeUnique,
        typeIdentifiant,
        typeContribuable,
        donneesComplementaires
    }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,["dateNaissance","createdAt","dateExpiration","dateObtention"]);
      })
    );
  }

  public updateContribuable(guid: string,codeUnique: string,typeIdentifiant:string,typeContribuable:string, donneesComplementaires: any) {
    return this.http.patch<GeneralContribuable>(`${environment.USERS.IFU_API}/${guid}`, {
      codeUnique,
      typeIdentifiant,
      typeContribuable,
      donneesComplementaires
    }, { observe: "response" }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,["dateNaissance","createdAt","dateExpiration","dateObtention"]);
      })
    );
  }


}
