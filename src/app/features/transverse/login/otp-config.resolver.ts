import { Injectable } from '@angular/core';


import { Resolve } from '@angular/router';
import { OTPService } from '@sycadApp/services/data-references/system/otp.service';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class OTPConfigResolver implements Resolve<any> {
  constructor(private otpService: OTPService) {}

  resolve() {
    return this.otpService.getConfig().pipe(
      map(res => res),
      catchError(error => {
        location.href ="/";
        return of(null)
      })
    );

  }
}  



@Injectable()
export class OTPValidationResolver implements Resolve<any> {
  constructor(private otpService: OTPService) {}

  resolve() {
    return this.otpService.getReaderCheck().pipe(
      map(res => {
        if(!res) {
          location.href ="/";
        }
      }),
      catchError(error => {
        location.href ="/";
        return of(null)
      })
    );
  }
}  