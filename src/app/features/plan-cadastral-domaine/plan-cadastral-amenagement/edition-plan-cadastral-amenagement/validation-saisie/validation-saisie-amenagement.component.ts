import { Component, OnInit } from '@angular/core';
import { TransitionPlanCadastralComponent } from '@sycadApp/shared/form-components/processus/transition.plan-cadastral.component';

import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {MediaObserver} from '@angular/flex-layout';
import {FormBuilder, Validators} from '@angular/forms';

import {SycadUtils} from '@sycadShared/utils.functions';
import {PlanCadastralAmenagementElement} from '@sycadApp/models/workflow/cp-amenagement.model';
import { AmenagementService } from '@sycadApp/services/workflow/common/amenagement.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'pc-validation-saisie-amenagement',
  templateUrl: './validation-saisie-amenagement.component.html',
  styleUrls: ['./validation-saisie-amenagement.component.scss']
})
export class ValidationSaisieAmenagementComponent extends TransitionPlanCadastralComponent<PlanCadastralAmenagementElement> implements OnInit {

  constructor( public router: Router,
               public _snackBar: MatSnackBar,
               public confirmService: AppConfirmService,
               public _adapter: DateAdapter<any>,
               public mediaObserver: MediaObserver,
               public fb: FormBuilder,
               public planCadastralService: AmenagementService)
  {
    super(router,_snackBar,confirmService,_adapter,mediaObserver,fb);

    this.formulaire =this.fb.group({
      numero: [null, [Validators.required]],
      action: [null, [Validators.required]],
      dossier : this.fb.group({
        observation: [null]
      }),
    });
  }

  ngOnInit(): void {
    this.formulaire.patchValue({
      numero: this.planCadastral.numero,
      action: this.transition.code
    });
  }
  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }
    this.loadingEvent.emit(true);
    let {numero,action}=this.formulaire.value;
    let {observation}=this.formulaire.value.dossier;
    let dataPost= {
      numero,action,observation
    };
    this.planCadastralService.executer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
        this.openSnackBar("Exécution effectuée avec succès","OK");
        this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_AMENAGEMENT]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );

  }
  resetForm(){
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_AMENAGEMENT}`]);
    /*
    if(this.planCadastral.numero) {
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_AMENAGEMENT}`]);
    }else {
      this.formulaire.reset();
    }
    */
  }
}
