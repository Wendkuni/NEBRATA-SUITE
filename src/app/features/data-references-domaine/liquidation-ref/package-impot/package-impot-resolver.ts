import { PackageImpotService } from '@sycadApp/services/impot/package-impot.service';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';
import { environment } from 'environments/environment';
@Injectable()
export class PackageImpotResolver implements Resolve<any>{
  constructor(public service: PackageImpotService) {
  }
  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return this.service.get(id).pipe(
      map(res => {
        if (res && res.id) {
          return res;
        }
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_PACKAGE_IMPOT;
      }),
      catchError(error => {
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_PACKAGE_IMPOT;
        return of(null)
      })
    );

  }
}
