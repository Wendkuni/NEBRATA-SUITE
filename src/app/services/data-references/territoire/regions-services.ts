import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { GenericDatasource } from '@sycadApp/models/generic-datasource';
import { RegionElement } from '@sycadApp/models/data-references/territoire/region.model';

 

@Injectable(
)    
export class RegionsService extends GenericDatasource<RegionElement,RegionElement,RegionElement> {
    constructor(public http:HttpClient) { 
        super(http);
      } 
      public getUrl():string{
        return environment.TERRITOIRE.REGIONS_API;
      };
   
} 