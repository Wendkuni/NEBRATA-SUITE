
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {catchError, map} from 'rxjs/operators';

import {of} from 'rxjs';
import { environment } from 'environments/environment';
import { ActionProcessusEvent } from '@sycadApp/libs/model-table';
import { EnteteDossierService } from '@sycadApp/services/workflow/entete.service';
import { TransitionService } from '@sycadApp/services/workflow/transition.service';



export abstract class TransitionResolver implements Resolve<any>{


  constructor( public transitionService: TransitionService,   public router: Router) {}

  public abstract getUrl(): string;

  resolve(route: ActivatedRouteSnapshot) {
    const numero = route.paramMap.get("numero");
    const transitionCode = route.paramMap.get("transition");
    return this.transitionService.getTransitionOfDossier(transitionCode,numero).pipe(
      map(res => {

        if(res?.code) {
            return res;
        }
        location.href =  this.getUrl();
      }),
      catchError(error => {
        location.href = this.getUrl();
        return of(null)
      })
    );

  }

}




export abstract class ProcessusResolver implements Resolve<any>{

  codeProcessus:string;
  constructor(public enteteDossierService: EnteteDossierService,   public router: Router, public code:string) {
    this.codeProcessus=code;
  }

  public abstract getUrl(): string;

  resolve(route: ActivatedRouteSnapshot) {

    return this.enteteDossierService.getProcessus(this.codeProcessus).pipe(
      map(res => {

        if(res?.code) {
            return res;
        }
        location.href =  this.getUrl();
      }),
      catchError(error => {
        location.href = this.getUrl();
        return of(null)
      })
    );

  }

}
