import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GenericProcessusDatasource } from "@sycadApp/models/generic-datasource-processus";
import { ExonerationDossier } from "@sycadApp/models/impot/exoneration.model";
import { environment } from "environments/environment";

@Injectable()
export class ExonerationService extends GenericProcessusDatasource<ExonerationDossier, ExonerationDossier> {

 constructor(public http: HttpClient){
     super(http);
 }


 public  getDateFields(): string[] {
    return ['date', 'dateCreationDossier', 'dateNaissance', 'dateDoc', 'dateRealisation', 'dateExterne', 'dateMajPlan', 'dateDebut', 'dateFin', 'dateExpiration', 'dateDeCreation', 'createdAt', 'dateObtention', 'dateDelivrance', 'dateDoc', 'dateValidite', 'dateRetrait'];
  }

 getUrl(): string {
     return environment.PROCESSUS.EXONERATION_API;
 }
}