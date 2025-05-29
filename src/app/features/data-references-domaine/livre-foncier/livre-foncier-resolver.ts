import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { LivreFoncierService } from "@sycadApp/services/data-references/system/livre-foncier.service";
import { environment } from "environments/environment";
import { catchError, map, of } from "rxjs";

@Injectable()
export class LivreFoncierResolver implements Resolve<any> {
  constructor(private service: LivreFoncierService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");

    return this.service.get(id).pipe(
      map(res => {
        if (res && res.id) {
          return res;
        }
        location.href = environment.FRONTEND_ROUTES.ORGANIGRAMME_LIVRE_FONCIER;
      }),
      catchError(error => {
        location.href = environment.FRONTEND_ROUTES.ORGANIGRAMME_LIVRE_FONCIER;
        return of(null)
      })
    );
  }
}
