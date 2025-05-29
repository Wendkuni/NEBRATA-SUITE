import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap, share, finalize } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';
import { TokenJwt, AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';





@Injectable({ providedIn: 'root' })
export class AuthorisationService  {

    private listRoles: BehaviorSubject<String[]>=new BehaviorSubject<String[]>(null);

    constructor(private http: HttpClient) {
      // this.myRoles();
      }

  
      myRoles(): BehaviorSubject<String[]> {
        if( !this.listRoles.getValue()) {
            this.http.get<String[]>(`${environment.AUTH.LIST_MY_ROLES}`,{ withCredentials:true }).pipe(
                tap(list => {
                    if(list){
                        this.listRoles.next(list);
                    }                
                }),
                share()
                ).subscribe();
        }
        return this.listRoles;
      }
}



