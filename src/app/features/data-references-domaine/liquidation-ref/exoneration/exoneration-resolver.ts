import { ExonerationService } from '@sycadApp/services/evaluation/exoneration.service';
import {ActivatedRouteSnapshot} from '@angular/router';
import {catchError, map} from 'rxjs/operators';

import {of} from 'rxjs';
import { environment } from 'environments/environment';

export class ExonerationResolver{
  constructor(public service: ExonerationService) {
  }
  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return this.service.get(id).pipe(
      map(res => {
        if (res && res.id) {
          return res;
        }
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_EXONERATION;
      }),
      catchError(error => {
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_EXONERATION;
        return of(null)
      })
    );

  }
}
