import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {TransitionMandatComponent} from '@sycadApp/features/annuaire-identite-domaine/gestion-mandat/edition-mandat/transition-mandat.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {MediaObserver} from '@angular/flex-layout';
import {FormBuilder, Validators} from '@angular/forms';
import {CategoriePieceService} from '@sycadApp/services/data-references/system/categorie-piece.service';
import {ContribuableService} from '@sycadApp/services/data-references/system/contribuable.service';
import {ProfessionService} from '@sycadApp/services/data-references/system/profession.service';
import {MandatsService} from '@sycadApp/services/workflow/mandats.service';
import {environment} from '../../../../../../environments/environment';
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-valider-mandat',
  templateUrl: './valider-mandat.component.html',
  styleUrls: ['./valider-mandat.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ValiderMandatComponent extends TransitionMandatComponent implements OnInit {

  constructor(public dialog: MatDialog,
              public router: Router,
              public _snackBar: MatSnackBar,
              public confirmService: AppConfirmService,
              public _adapter: DateAdapter<any>,
              public mediaObserver: MediaObserver,
              public fb: FormBuilder,
              public categoriePieceService: CategoriePieceService,
              public contribuableService: ContribuableService,
              public professionService: ProfessionService,
              public mandatService: MandatsService) {
    super(router, dialog,_snackBar, confirmService,_adapter, fb, mediaObserver, contribuableService, professionService, categoriePieceService, mandatService);
    this.formulaire = this.fb.group({
      numero: [null, [Validators.required]],
      action: [null, [Validators.required]],
      dossier : this.fb.group({
        observation: [null]
      }),
    });
  }

  ngOnInit(): void {
    this.formulaire.patchValue({
      numero: this.mandat.numero,
      action: this.transition.code
    });
  }

  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }
    this.loadingEvent.emit(true);
    let {  action, numero } = this.formulaire.value;
    let {observation}=this.formulaire.value.dossier;
    let dossier = { action, numero,observation} ;

    this.mandatService.executer(dossier).subscribe(data => {
        this.loadingEvent.emit(false);
        this.openSnackBar("Mandat modifié avec succès", "OK");
        this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_MANDAT]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }

  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_MANDAT}`]);
  }

}
