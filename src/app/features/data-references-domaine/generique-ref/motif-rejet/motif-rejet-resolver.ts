import { Injectable } from "@angular/core";
import { environment } from "../../../../../environments/environment";
import { of } from "rxjs";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import {
  MotifRejetService
} from "@sycadApp/services/data-references/system/motif-rejet.service";




@Injectable()
export class MotifRejetResolver implements Resolve<any> {
  constructor(private service: MotifRejetService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return this.service.get(id).pipe(
      map(res => {
        if (res && res.id) {
          return res;
        }
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_MOTIF_REJET;
      }),
      catchError(error => {
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_MOTIF_REJET;
        return of(null)
      })
    );

  }
}
