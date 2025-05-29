import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import { GenericDatasource } from '@sycadApp/models/generic-datasource';
import { Permission } from '@sycadApp/models/data-references/security/permission.model';




@Injectable(
)    
export class PermissionService extends GenericDatasource<Permission,Permission,Permission> {
    constructor(public http:HttpClient) { 
        super(http);
      } 
      public getUrl():string{
        return environment.SECURITY.PERMISSIONS_API;
      };
   
} 