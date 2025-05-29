import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { GenericDatasource } from '@sycadApp/models/generic-datasource';
import { SaisieDiffereeAttributionContexte, SaisieDiffereeAttributionContexteElement } from '@sycadApp/models/workflow/sd-saisie-differee-attribution-contexte.model';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';

@Injectable()
export class SaisieDiffereeAttributionContexteService extends GenericDatasource<SaisieDiffereeAttributionContexte,SaisieDiffereeAttributionContexte,SaisieDiffereeAttributionContexte>{


  constructor(public http: HttpClient) {
    super(http);
  }

  public  getDateFields(): string[] {
    return ["date","dateCreationDossier","dateObtention","dateModificationDossier","debut","fin","dateExterne","dateMajPlan","dateExpiration","dateDeCreation","createdAt","dateObtention","dateDelivrance","dateDoc","dateValidite","dateRetrait"];
  }

  getUrl(): string {
    return environment.SAISIE_DIFFEREE.SAISIE_DIFFEREE_ATTRIBUTION_CONTEXTE_API;
  }
  public ajouter(ressource: any) {
    return this.http.post(this.getUrl(), ressource).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }

  public recuperer() {
    return this.http.get<SaisieDiffereeAttributionContexteElement>(this.getUrl()).pipe(
      tap((element:SaisieDiffereeAttributionContexteElement) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }

  public supprimer() {
    return this.http.delete(this.getUrl());
  }
}
