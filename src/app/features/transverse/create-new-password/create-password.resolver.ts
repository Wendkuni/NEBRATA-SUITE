import { Injectable } from "@angular/core";
import { CreateNewPasswordService } from '@sycadApp/services/data-references/system/create-new-password.service';

import { Resolve } from "@angular/router";

import { ActivatedRouteSnapshot } from "@angular/router";
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class CreatePasswordResolver implements Resolve<any> {
  constructor(private createNewPasswordService: CreateNewPasswordService) {
  }

  resolve(router: ActivatedRouteSnapshot) {
    return this.createNewPasswordService.checkUser(router.params.code).pipe(
      map(res => {
        let httpStatus = res.status;
        return res.body;
      }),
      catchError(error => {

        location.href ="/";
        return of(null)
      })
    );
  }
}
