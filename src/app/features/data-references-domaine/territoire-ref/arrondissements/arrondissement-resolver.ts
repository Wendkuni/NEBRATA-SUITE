import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {Injectable} from "@angular/core";

import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import {catchError, map} from "rxjs/operators";
import {environment} from '../../../../../environments/environment';
import {of} from "rxjs";
@Injectable()
export class ArrondissementResolver implements Resolve<any> {
  constructor(private service: ArrondissementsService) {
  }
  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return this.service.get(id).pipe(
      map(res => {
        if (res && res.id) {
          return res;
        }
        location.href = environment.FRONTEND_ROUTES.TERRITOIRE_ARRONDISSEMENT;
      }),
      catchError(error => {
        location.href = environment.FRONTEND_ROUTES.TERRITOIRE_ARRONDISSEMENT;
        return of(null)
      })
    );

  }
}
