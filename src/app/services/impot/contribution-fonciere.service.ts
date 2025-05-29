import { Injectable } from '@angular/core';
import {GenericProcessusDatasource} from '@sycadApp/models/generic-datasource-processus';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import { DossierContributionFonciere } from '@sycadApp/models/impot/contribution-fonciere.model';
import { tap, timeout } from 'rxjs';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';


@Injectable()
export class ContributionFonciereService extends GenericProcessusDatasource<DossierContributionFonciere, DossierContributionFonciere>{

  constructor(public http: HttpClient) {
    super(http);
  }
  public  getDateFields(): string[] {
    return ["date","dateCreationDossier","dateModificationDossier","dateExterne","debut","fin","dateExpiration","dateDeCreation","createdAt","dateObtention","dateDelivrance","dateDoc","dateValidite","dateRetrait","dateNaissance"];
  }

  getUrl(): string {
    return environment.PROCESSUS.CONTRIBUTION_FONCIERE;
  }

  public generation(data: any) {
    return this.http.post(this.getUrl()+"/generation", data).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }
//
}
