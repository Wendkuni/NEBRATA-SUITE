import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { of } from "rxjs";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import {AgentsService} from '@sycadApp/services/data-references/contribuables/agent.service';




@Injectable()
export class AgentResolver implements Resolve<any> {
  constructor(private service: AgentsService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const guid = route.paramMap.get("guid");
    return this.service.get(guid).pipe(
      map(res => {
          if(res && res.guid) {
            return res;
          }
          location.href =environment.FRONTEND_ROUTES.CONTRIBUABLE_AGENT;
      }),
      catchError(error => {
        location.href =environment.FRONTEND_ROUTES.CONTRIBUABLE_AGENT;
        return of(null)
      })
    );

  }
}
