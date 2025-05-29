import { Observable } from 'rxjs';
import { PageDetailServices } from './page-detail.services';
import { Resolve } from "@angular/router";
import { Injectable } from '@angular/core';

@Injectable()
export class PageDetailResolve implements Resolve<any>{
    constructor(private pageDetailService: PageDetailServices){}
    async resolve() {
      const item = await this.pageDetailService.findAll();
      return item
    }
}
