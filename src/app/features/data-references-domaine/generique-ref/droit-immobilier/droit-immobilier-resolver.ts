import { Injectable } from "@angular/core";
import { environment } from "../../../../../environments/environment";
import { of } from "rxjs";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import {
  DroitImmobilierService
} from "@sycadApp/services/data-references/system/droit-immobilier.service";




@Injectable()
export class DroitImmobilierResolver implements Resolve<any> {
  constructor(private service: DroitImmobilierService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return this.service.get(id).pipe(
      map(res => {
        if (res && res.id) {
          return res;
        }
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_DROIT_IMMOBILIER;
      }),
      catchError(error => {
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_DROIT_IMMOBILIER;
        return of(null)
      })
    );

  }
}
