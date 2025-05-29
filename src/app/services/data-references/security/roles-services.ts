import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { GenericDatasource } from '@sycadApp/models/generic-datasource';
import { RoleAutocomplete, RoleElement, RoleItem } from '@sycadApp/models/data-references/security/role.model';



 
@Injectable(
)    
export class RolesService extends GenericDatasource<RoleItem,RoleElement,RoleAutocomplete> {
    constructor(public http:HttpClient) { 
        super(http);
      } 
      public getUrl():string{
        return environment.SECURITY.ROLES_API;
      };
   
} 