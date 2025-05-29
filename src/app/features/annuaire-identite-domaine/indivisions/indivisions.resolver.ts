import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { of } from "rxjs";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import {IndivisionsService} from '@sycadApp/services/data-references/contribuables/indivisions.service';



@Injectable()
export class IndivisionsResolver implements Resolve<any> {
  constructor(private service: IndivisionsService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const guid = route.paramMap.get("guid");
    return this.service.get(guid).pipe(
      map(res => {
        if (res && res.guid) {
          return res;
        }
        location.href = environment.FRONTEND_ROUTES.CONTRIBUABLE_INDIVISION;
      }),
      catchError(error => {
        location.href = environment.FRONTEND_ROUTES.CONTRIBUABLE_INDIVISION;
        return of(null)
      })
    );

  }
}
