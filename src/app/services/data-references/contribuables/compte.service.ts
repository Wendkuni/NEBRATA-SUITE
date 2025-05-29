import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import { GenericDatasource } from '@sycadApp/models/generic-datasource';
import {environment} from '../../../../environments/environment';
import { CompteElement } from '@sycadApp/models/data-references/contribuables/compte.model';
import { Observable, tap } from 'rxjs';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';
import { GenericProcessusDatasource } from '@sycadApp/models/generic-datasource-processus';
import { ContribuableElement } from '@sycadApp/models/data-references/contribuables/global.model';

@Injectable()
export class CompteService extends  GenericProcessusDatasource<CompteElement, CompteElement>{

  constructor(public http: HttpClient) {
    super(http);
}
///api/processus/creation-compte-contribuable
public  getDateFields(): string[] {
    return ["dateValidite","dateCreationDossier","dateModificationDossier","dateDoc","dateCreation","dateNaissance","createdAt","dateExpiration","dateObtention", "dateDeCreation"];
  }
getUrl(): string {
    return environment.USERS.NEW_COMPTE;
}

public creerMonDossier(ressource: any) {
  return this.http.post(environment.USERS.NEW_COMPTE_PUBLIC+"/creation", ressource).pipe(
    tap((element) => {
      GlobalDateConverter.convertToDate(element,this.getDateFields());
    })
  );
}

public correspondanceContribuable(numero: string): Observable<HttpResponse<ContribuableElement[]>> {
  let params = new HttpParams()
    .set("numero", numero);

    return this.http.get<ContribuableElement[]>(this.getUrl() + "/correspondance-contribuable", {
    observe: "response",
    params,
  }).pipe(
    tap((element) => {
      GlobalDateConverter.convertToDate(element,this.getDateFields());
    })
  );
}

//
public updateMonDossier(ressource: any) {
  return this.http.patch(environment.USERS.NEW_COMPTE_PUBLIC+"/renvoie-to-verification", ressource).pipe(
    tap((element) => {
      GlobalDateConverter.convertToDate(element,this.getDateFields());
    })
  );
}
public checkTokenDossierSaisie(numero: string, token: String, recapchaToken: string) {
  return this.http.get<CompteElement>(`${environment.USERS.NEW_COMPTE_PUBLIC}/check-dossier-saisie/${numero}/${token}/${recapchaToken}`).pipe(
    tap((element:CompteElement) => {
      GlobalDateConverter.convertToDate(element,this.getDateFields());
    })
  );  
}


searchTelephone( numero: string) {
  return this.http.get<boolean>(`${environment.USERS.NEW_COMPTE_PUBLIC}/telephone/${numero}`);
}

searchEmail( email: string) {
  return this.http.get<boolean>(`${environment.USERS.NEW_COMPTE_PUBLIC}/email/${email}`);
}
}
