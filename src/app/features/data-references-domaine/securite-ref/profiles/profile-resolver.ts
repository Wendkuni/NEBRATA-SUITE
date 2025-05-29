import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { of } from "rxjs";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { ProfilesService } from "@sycadApp/services/data-references/security/profiles.service";




@Injectable()
export class ProfileResolver implements Resolve<any> {
  constructor(private service: ProfilesService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return this.service.get(id).pipe(
      map(res => {
        if (res && res.id) {
          return res;
        }
        location.href = environment.FRONTEND_ROUTES.SECURITY_PROFILE;
      }),
      catchError(error => {
        location.href = environment.FRONTEND_ROUTES.SECURITY_PROFILE;
        return of(null)
      })
    );

  }
}
