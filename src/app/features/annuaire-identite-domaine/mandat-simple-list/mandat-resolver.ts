import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { MandatService } from '@sycadApp/services/workflow/mandat.service';
import { environment } from 'environments/environment';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class MandatResolver implements Resolve<any> {
  constructor(private service: MandatService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return this.service.get(id).pipe(
      map(res => {
        if (res && res.id) {
          return res;
        }
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_MANDAT;
      }),
      catchError(error => {
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_MANDAT;
        return of(null)
      })
    );

  }
}