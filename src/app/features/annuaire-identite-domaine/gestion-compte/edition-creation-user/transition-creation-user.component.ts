import {Directive, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { MediaObserver } from "@angular/flex-layout";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import {  Document, Processus, Transition } from "@sycadApp/models/workflow/common/general";
import { AppConfirmService } from "@sycadApp/shared/app-confirm/app-confirm.service";
import { TransitionComponent } from "@sycadApp/shared/form-components/processus/transition/component.transition";
import { environment } from "environments/environment";
import { CompteElement } from "@sycadApp/models/data-references/contribuables/compte.model";
import {CompteService} from '@sycadApp/services/data-references/contribuables/compte.service';


@Directive()
export class TransitionCreationUserComponent extends TransitionComponent{

    @Input()
  public compteContribuable: CompteElement;

  public typeCompte;

  @Input()
  public transition: Transition;

  @Input()
  public processus: Processus;

  public isLoadingResults = false;

  @Output()
  public loadingEvent: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  get dossier() { return this.formulaire.get('dossier'); 
}

  constructor(
    public router: Router,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public compteService: CompteService
  ) {
    super(mediaObserver);
  }

  initFormulaire(){
    if (this.compteContribuable.typeCompte === 'CONTRIBUABLEMORALE') {
      this.formulaire = this.fb.group({
        numero: [null, [Validators.required]],
        action: [null, [Validators.required]],
        dossier: this.fb.group({
          observation: [null, [Validators.required]],
        })
      });
      this.formulaire.patchValue({
        numero: this.compteContribuable.numero,
        action: this.transition.code,
      });
    }

    if (this.compteContribuable.typeCompte === 'ACTEUR') {
      this.formulaire = this.fb.group({
        numero: [null, [Validators.required]],
        action: [null, [Validators.required]],
        dossier: this.fb.group({
          observation: [null, [Validators.required]],
        })
      });

      this.formulaire.patchValue({
        numero: this.compteContribuable.numero,
        action: this.transition.code
      });

    }

    if (this.compteContribuable.typeCompte === 'CONTRIBUABLEPHYSIQUE') {
      this.formulaire = this.fb.group({
        numero: [null, [Validators.required]],
        action: [null, [Validators.required]],
        dossier: this.fb.group({
          observation: [null, [Validators.required]],
        })
      });

      this.formulaire.patchValue({
        numero: this.compteContribuable.numero,
        action: this.transition.code
      });

    }

    if (this.compteContribuable.typeCompte === 'AGENT') {
      this.formulaire = this.fb.group({
        numero: [null, [Validators.required]],
        action: [null, [Validators.required]],
        dossier: this.fb.group({
          observation: [null, [Validators.required]],
        })
      });

      this.formulaire.patchValue({
        numero: this.compteContribuable.numero,
        action: this.transition.code
      });

    }
  }


  

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }


  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.GESTION_COMPTE}`]);
  }

 
}
