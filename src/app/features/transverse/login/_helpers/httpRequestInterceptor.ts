import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpXsrfTokenExtractor
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private headerName = 'X-XSRF-TOKEN';


  constructor(private tokenExtractor: HttpXsrfTokenExtractor) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
      //// console.log("interceptor: " + req.url);
      req = req.clone({
        withCredentials: true
      });
      if(!environment.production) {
        let token = this.tokenExtractor.getToken() as string;
        if (token !== null && !req.headers.has(this.headerName)) {
          req = req.clone({ headers: req.headers.set(this.headerName, token) });
        }
      }

      return next.handle(req);
  }
}
