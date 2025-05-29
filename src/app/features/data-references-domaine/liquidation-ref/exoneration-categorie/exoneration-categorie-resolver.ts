import { ExonerationCategorieService } from '@sycadApp/services/evaluation/exoneration-categorie.service';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';
import { environment } from 'environments/environment';
@Injectable()
export class ExonerationCategorieResolver{
  constructor(public service: ExonerationCategorieService) {
  }
  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return this.service.get(id).pipe(
      map(res => {
        if (res && res.id) {
          return res;
        }
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_EXONERATION_CATEGORIE;
      }),
      catchError(error => {
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_EXONERATION_CATEGORIE;
        return of(null)
      })
    );

  }
}
