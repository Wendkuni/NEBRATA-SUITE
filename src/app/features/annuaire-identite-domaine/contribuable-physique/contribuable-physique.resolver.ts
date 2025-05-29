import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { of } from "rxjs";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import {ContribuablePhysiqueService} from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';




@Injectable()
export class ContribuablePhysiqueResolver implements Resolve<any> {
  constructor(private service: ContribuablePhysiqueService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const guid = route.paramMap.get("guid");
    return this.service.get(guid).pipe(
      map(res => {
          if(res && res.guid) {
            return res;
          }
          location.href =environment.FRONTEND_ROUTES.CONTRIBUABLE_PHYSIQUE;
      }),
      catchError(error => {
        location.href =environment.FRONTEND_ROUTES.CONTRIBUABLE_PHYSIQUE;
        return of(null)
      })
    );

  }
}
