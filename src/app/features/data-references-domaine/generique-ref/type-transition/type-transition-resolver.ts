import { Injectable } from "@angular/core";
import { environment } from "../../../../../environments/environment";
import { of } from "rxjs";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import {
  TypeTransitionService
} from "@sycadApp/services/data-references/system/type-transition.service";




@Injectable()
export class TypeTransitionResolver implements Resolve<any> {
  constructor(private service: TypeTransitionService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return this.service.get(id).pipe(
      map(res => {
        if (res && res.id) {
          return res;
        }
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_TYPE_TRANSITION;
      }),
      catchError(error => {
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_TYPE_TRANSITION;
        return of(null)
      })
    );

  }
}
