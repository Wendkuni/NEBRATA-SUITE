import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import { BureauService } from '@sycadApp/services/data-references/organigramme/bureau.service';
import {catchError, map} from "rxjs/operators";
import {environment} from "../../../../../environments/environment";
import {of} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class BureauResolver implements Resolve<any>{
  constructor(private service: BureauService) {
  }
  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return this.service.get(id).pipe(
      map(res => {
        if (res && res.id) {
          return res;
        }
        location.href = environment.FRONTEND_ROUTES.ORGANIGRAMME_BUREAU;
      }),
      catchError(error => {
        location.href = environment.FRONTEND_ROUTES.ORGANIGRAMME_BUREAU;
        return of(null)
      })
    );

  }
}
