import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { of } from "rxjs";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { CategorieActeurService } from '@sycadApp/services/data-references/system/categorie-acteur.service';




@Injectable()
export class CategorieActeurResolver implements Resolve<any> {
  constructor(private service: CategorieActeurService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return this.service.get(id).pipe(
      map(res => {
        if (res && res.id) {
          return res;
        }
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_CATEGORIE_ACTEUR;
      }),
      catchError(error => {
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_CATEGORIE_ACTEUR;
        return of(null)
      })
    );

  }
}
