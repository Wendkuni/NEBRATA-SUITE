import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { of } from "rxjs";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { DocumentTypeService } from "@sycadApp/services/data-references/system/document-type.service";




@Injectable()
export class DocumentTypeResolver implements Resolve<any> {
  constructor(private service: DocumentTypeService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return this.service.get(id).pipe(
      map(res => {
        if (res && res.id) {
          return res;
        }
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_TYPE_DOCUMENT;
      }),
      catchError(error => {
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_TYPE_DOCUMENT;
        return of(null)
      })
    );

  }
}
