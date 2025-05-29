import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { ExonerationCategorieService } from '@sycadApp/services/evaluation/exoneration-categorie.service';
import { ExonerationService } from '@sycadApp/services/impot/exoneration.service';
import { NatureImpotService } from '@sycadApp/services/impot/nature-impot.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { environment } from 'environments/environment';
import { TransitionExonerationComponent } from '../transition-exoneration.component';

@Component({
  selector: 'app-annuler-exoneration',
  templateUrl: './annuler-exoneration.component.html',
  styleUrls: ['./annuler-exoneration.component.scss']
})
export class AnnulerExonerationComponent extends TransitionExonerationComponent implements OnInit {

  constructor(public router: Router,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public exonerationService: ExonerationService,
    public exonerationCategorieService: ExonerationCategorieService,
    public natureImpotService: NatureImpotService,
    public contribuableService: ContribuableService,
    public professionService: ProfessionService,
    public categoriePieceService: CategoriePieceService,
    public parcelleService: ParcelleService)
     {
      super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver,fb, exonerationService,exonerationCategorieService,natureImpotService,contribuableService, professionService,categoriePieceService,parcelleService);

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
      numero: this.exonerationDossier.numero,
      action: this.transition.code
    });
  }
  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }


    let {  action, numero } = this.formulaire.value;
    let {observation}=this.formulaire.value.dossier;
    let dossier = { action, numero,observation} ;


    this.loadingEvent.emit(true);
    this.exonerationService.executer(dossier).subscribe(data => {
      this.loadingEvent.emit(false);
        this.openSnackBar("Exécution effectuée avec succès","OK");
        this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_EXONERATION]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );

  }
  resetForm(){
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_EXONERATION}`]);
  }


}
