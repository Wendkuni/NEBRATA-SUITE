import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';
import { CategoriePieceProcessus, MandatElement } from '@sycadApp/models/workflow/common/general';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { MandatsService } from '@sycadApp/services/workflow/mandats.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { environment } from 'environments/environment';
import { TransitionMandatComponent } from '../transition-mandat.component';

@Component({
  selector: 'app-annuler-mandat',
  templateUrl: './annuler-mandat.component.html',
  styleUrls: ['./annuler-mandat.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnnulerMandatComponent extends TransitionMandatComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public router: Router,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public categoriePieceService: CategoriePieceService,
    public contribuableService: ContribuableService,
    public professionService: ProfessionService,
    public mandatService: MandatsService) 
    {
    super(router, dialog,_snackBar, confirmService,_adapter,fb, mediaObserver,contribuableService,professionService,categoriePieceService,mandatService);
    
    this.formulaire = this.fb.group({
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
    this._adapter.setLocale("fr");
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
        this.openSnackBar("Dossier de mandat annulé avec succès", "OK");
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
