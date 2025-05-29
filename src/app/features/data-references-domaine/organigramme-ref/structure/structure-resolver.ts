import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { of } from "rxjs";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';




@Injectable()
export class StructureResolver implements Resolve<any> {
  constructor(private service: StructureService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return this.service.get(id).pipe(
      map(res => {
        if (res && res.id) {
          return res;
        }
        location.href = environment.FRONTEND_ROUTES.ORGANIGRAMME_STRUCTURE;
      }),
      catchError(error => {
        location.href = environment.FRONTEND_ROUTES.ORGANIGRAMME_STRUCTURE;
        return of(null)
      })
    );

  }
}
