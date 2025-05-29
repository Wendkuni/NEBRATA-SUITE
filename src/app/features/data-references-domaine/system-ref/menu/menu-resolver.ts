import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { of } from "rxjs";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import {MenuService} from '@sycadApp/services/data-references/system/menu.service';




@Injectable()
export class MenuResolver implements Resolve<any> {
  constructor(private service: MenuService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return this.service.get(id).pipe(
      map(res => {
        if (res && res.id) {
          return res;
        }
        location.href = environment.FRONTEND_ROUTES.APP_MENU;
      }),
      catchError(error => {
        location.href = environment.FRONTEND_ROUTES.APP_MENU;
        return of(null)
      })
    );

  }
}
