import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { GenericDatasource } from '@sycadApp/models/generic-datasource';
import { IndivisionRelationItem, IndivisionRelationElement, IndivisionRelationAutocomplete } from '@sycadApp/models/data-references/system/indivision-relation.model';



@Injectable(
)
export class IndivisionrelationService extends GenericDatasource<IndivisionRelationItem,IndivisionRelationElement,IndivisionRelationAutocomplete> {
    constructor(public http:HttpClient) {
        super(http);
      }
      public getUrl():string{
        return environment.APPLICATION.INDIVISIONS_REALATION_API;
      };
 
      public updateQualitesIndivision(id:string,ressource:any){
      return this.http.patch(`${environment.APPLICATION.INDIVISIONS_REALATION_API}/${id}/qualites-indivision`, ressource);
       }

      public deleteQualitesIndivision(id: number) {
      return this.http.delete(`${environment.APPLICATION.INDIVISIONS_REALATION_API}/qualites-indivision` + "/" + id);
   } 
}
