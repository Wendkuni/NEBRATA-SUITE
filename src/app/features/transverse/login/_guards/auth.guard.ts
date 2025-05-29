import { Injectable, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';
import { environment } from 'environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {


    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
      
     }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {


        if(this.authenticationService.pageFirstTime){
            //console.log("pageFirstTime true")
            this.authenticationService.pageLoaded();
        return this.authenticationService.checkIfAmLogin();
           
        }else {
            //console.log("pageFirstTime false")
                   const currentToken = this.authenticationService.currentTokenValue;
                  
                    if (currentToken && currentToken.token) {
                        return true;
                    }
                    this.router.navigate(['/'+environment.FRONTEND_ROUTES.SITE_EXTERNE], { queryParams: { returnUrl: state.url } });
                    return false;
        }
        
    }
}