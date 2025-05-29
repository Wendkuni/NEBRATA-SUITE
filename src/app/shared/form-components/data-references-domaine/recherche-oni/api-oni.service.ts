import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { GeneralContribuable, TypePiece } from '@sycadApp/models/data-references/contribuables/global.model';

import { Observable, of, tap } from "rxjs";
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';



@Injectable({ providedIn: 'root' })
export class ONIApiService {
  constructor(public http: HttpClient) {
  }

checkIfContribuableExist(nom: string, numeroPiece: string, typePiece: string) {
    return this.http.get<GeneralContribuable>(`${environment.USERS.CONTRIBUABLE_PHYSIQUE_API}/${typePiece}/${nom}/${numeroPiece}`,{ observe: "response" }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,["dateNaissance","createdAt","dateExpiration","dateObtention"]);
      })
    );
}

importContribuable(nom: string, numeroPiece: string, typePiece: string, typeContribuable: string, payload: any) {
  return this.http.post<GeneralContribuable>(`${environment.USERS.CONTRIBUABLE_PHYSIQUE_API}/${typePiece}/${typeContribuable}/${nom}/${numeroPiece}`, payload, { observe: "response" }).pipe(
    tap((element) => {
      GlobalDateConverter.convertToDate(element,["dateNaissance","createdAt","dateExpiration","dateObtention"]);
    })
  );
}

updateContribuable(guid: string, codeUnique: string, nom: string, numeroPiece: string, typePiece: string, typeContribuable: string, payload: any) {
  return this.http.patch<GeneralContribuable>(`${environment.USERS.CONTRIBUABLE_PHYSIQUE_API}/${guid}/${codeUnique}/${typePiece}/${typeContribuable}/${nom}/${numeroPiece}`, payload, { observe: "response" }).pipe(
    tap((element) => {
      GlobalDateConverter.convertToDate(element,["dateNaissance","createdAt","dateExpiration","dateObtention"]);
    })
  );
}

}
