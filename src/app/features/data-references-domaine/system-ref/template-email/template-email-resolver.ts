import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { of } from "rxjs";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { TemplateEmailService } from "@sycadApp/services/data-references/system/template-email.service";




@Injectable()
export class TemplateEmailResolver implements Resolve<any> {
  constructor(private service: TemplateEmailService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return this.service.get(id).pipe(
      map(res => {
        if (res && res.id) {
          return res;
        }
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_TEMPLATE_EMAIL;
      }),
      catchError(error => {
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_TEMPLATE_EMAIL;
        return of(null)
      })
    );

  }
}