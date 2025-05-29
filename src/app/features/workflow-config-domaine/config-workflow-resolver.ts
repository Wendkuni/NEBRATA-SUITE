import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { of } from "rxjs";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { ConfigWorkflowService } from "@sycadApp/services/workflow/config-workflow.service";




@Injectable()
export class ConfigWorkflowResolver implements Resolve<any> {
  constructor(private service: ConfigWorkflowService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const code = route.paramMap.get("code");
    return this.service.get(code).pipe(
      map(res => {
        if (res && res.code) {
          return res;
        }
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_WORKFLOW;
      }),
      catchError(error => {
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_WORKFLOW;
        return of(null)
      })
    );

  }
}
