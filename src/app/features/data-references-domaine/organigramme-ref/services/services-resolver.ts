import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { of } from "rxjs";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { ServiceAdministratifService } from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';
@Injectable()
export class ServicesResolver implements Resolve<any> {
  constructor(private service: ServiceAdministratifService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return this.service.get(id).pipe(
      map(res => {
        if (res && res.id) {
          return res;
        }
          location.href = environment.FRONTEND_ROUTES.ORGANIGRAMME_SERVICE;
      }),
      catchError(error => {
        location.href = environment.FRONTEND_ROUTES.ORGANIGRAMME_SERVICE;
        return of(null)
      })
    );

  }
}
