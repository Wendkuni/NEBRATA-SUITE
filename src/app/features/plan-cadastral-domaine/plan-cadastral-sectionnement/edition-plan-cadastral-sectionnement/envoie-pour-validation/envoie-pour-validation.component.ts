import { Component, OnInit } from '@angular/core';
import { TransitionPlanCadastralComponent } from '@sycadApp/shared/form-components/processus/transition.plan-cadastral.component';
;
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { DateAdapter } from '@angular/material/core';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import { FormBuilder, FormArray, Validators } from '@angular/forms';

import { environment } from 'environments/environment';
import { SycadUtils } from '@sycadApp/shared/utils.functions';

import { PlanCadastralSectionnementElement } from '@sycadApp/models/workflow/common/sectionnement.model';
import { PlanCadastralSectionnementService } from '@sycadApp/services/workflow/common/sectionnement-services';

@Component({
  selector: 'pc-sectionnement-envoie-pour-validation',
  templateUrl: './envoie-pour-validation.component.html',
  styleUrls: ['./envoie-pour-validation.component.scss']
})
export class PCSecEnvoiePourValidationComponent extends TransitionPlanCadastralComponent<PlanCadastralSectionnementElement>  implements OnInit {

  constructor(
    public router: Router,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public planCadastralService: PlanCadastralSectionnementService,
    ){
    super(router,_snackBar,confirmService,_adapter,mediaObserver,fb);

    this.formulaire =this.fb.group({
      numero: [null, [Validators.required]],
      action: [null, [Validators.required]],
      dossier : this.fb.group({
        observation: [null]
      }),
    });
   }
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
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
      this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_SECTIONNEMENT]);
    },
    errorResponse => {
      this.loadingEvent.emit(false);
      SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
    }
  );

  }
  resetForm(){
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_SECTIONNEMENT}`]);
    /*
    if(this.planCadastral.numero) {
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_SECTIONNEMENT}`]);
    }else {
      this.formulaire.reset();
    } */
  }
}
