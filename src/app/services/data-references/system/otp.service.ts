import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';




@Injectable()
export class OTPService  {

  constructor(public http:HttpClient) {

  }

  public getConfig() {
    return this.http.get<any>(`${environment.SECURITY.OTP_CONFIG_API}`);
  }

  public getReaderCheck() {
    return this.http.get<Boolean>(`${environment.SECURITY.OTP_READER_CHECK_API}`);
  }

  public validateConfig(code: string) {

    let params = new HttpParams()
    .set("code",code);

    return this.http.patch<boolean>(`${environment.SECURITY.OTP_CONFIG_VALIDATION_API}`,params);
  }

  public validateCode(code: string) {

    let params = new HttpParams()
    .set("code",code);

    return this.http.patch<boolean>(`${environment.SECURITY.OTP_CHECK_API}`,params);
  }
}
