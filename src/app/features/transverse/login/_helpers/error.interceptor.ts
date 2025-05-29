import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError, timer, of } from 'rxjs';
import { catchError, retryWhen, mergeMap } from 'rxjs/operators';
import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';



@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService, public router: Router) { }

  getPathUrl(stringUrl) {
    let parsedUrl = new URL(stringUrl)
    //// console.log("parsedUrl",parsedUrl)
    // sconsole.log("parsedUrl.pathname",parsedUrl.pathname)
    return parsedUrl.pathname;
  }

  private shouldRetry = (error) => (error.status >= 500 && error.status !== 401 && error.status !== 412 && error.status !== 428);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { shouldRetry } = this;




    return next.handle(request).pipe(
      retryWhen(genericRetryStrategy({
        shouldRetry
      })),
      catchError(err => {



        if (err.status === 401) {
          let url = (environment.production) ? this.getPathUrl(err.url) : err.url;
          //// console.log("url error interceptor ",url)
          if (url !== environment.AUTH.LOGIN_API && url !== environment.AUTH.REFRESH_TOKEN_API) {
            this.authenticationService.logout();
            return;
          }
        }
        // PRECONDITION_REQUIRED(428, "Precondition Required"), 
        if (err.status === 428) {
          this.router.navigate(["/login/otp-config"]);
          return of(null);
        }

        // PRECONDITION_FAILED(412, "Precondition Failed"),

        if (err.status === 412) {
          this.router.navigate(["/login/otp-validation"]);
          return of(null);
        }

        return throwError(err);

      }))

  }
}


export interface RetryParams {
  maxAttempts?: number;
  scalingDuration?: number;
  shouldRetry?: ({ status: number }) => boolean;
}

const defaultParams: RetryParams = {
  maxAttempts: 2,
  scalingDuration: 2000,
  shouldRetry: ({ status }) => status >= 400
}

export const genericRetryStrategy = (params: RetryParams = {}) => (attempts: Observable<any>) => attempts.pipe(
  mergeMap((error, i) => {
    const { maxAttempts, scalingDuration, shouldRetry } = { ...defaultParams, ...params }
    const retryAttempt = i + 1;

    if (retryAttempt > maxAttempts || !shouldRetry(error)) {
      return throwError(error);
    }
    return timer(retryAttempt * scalingDuration);
  })
);