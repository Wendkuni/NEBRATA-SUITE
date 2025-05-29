
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Injectable} from '@angular/core';

import {catchError, map} from 'rxjs/operators';

import {of} from 'rxjs';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { environment } from 'environments/environment';
@Injectable()
export class ActeurResolver implements Resolve<any>{

  constructor( private acteurService: ActeursService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const guid = route.paramMap.get("guid");
    return this.acteurService.get(guid).pipe(
      map(res => {
        if(res && res.guid) {
          return res;
        }
        location.href = environment.FRONTEND_ROUTES.CONTRIBUABLE_ACTEUR;
      }),
      catchError(error => {
        location.href = environment.FRONTEND_ROUTES.CONTRIBUABLE_ACTEUR;
        return of(null)
      })
    );

  }

}
