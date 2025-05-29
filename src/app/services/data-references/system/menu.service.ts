
import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {Menu} from '@sycadMenu/menu.model';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class MenuService extends GenericDatasource<Menu, Menu, Menu>{

  constructor(public http: HttpClient) { super(http);}
  getUrl(): string {
    return environment.APPLICATION.MENU_API;
  }
}
