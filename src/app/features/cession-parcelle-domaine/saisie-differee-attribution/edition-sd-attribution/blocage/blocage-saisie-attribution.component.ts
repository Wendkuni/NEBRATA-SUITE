import { Component, OnInit } from '@angular/core';

import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {MediaObserver} from '@angular/flex-layout';
import {FormBuilder, Validators} from '@angular/forms';
import {SycadUtils} from '@sycadShared/utils.functions';
import { environment } from 'environments/environment';
import { TransitionAttributionComponent } from '../transition-sd-attribution.component';
import { SdAttributionService } from '@sycadApp/services/workflow/sd-attribution.service';
import { CessionSourceService } from '@sycadApp/services/impot/cession-source.service';
import { MatDialog } from '@angular/material/dialog';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { ActeursService } from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import {
  DocumentTypeService
} from "@sycadApp/services/data-references/system/document-type.service";
import {
  MotifRejetService
} from "@sycadApp/services/data-references/system/motif-rejet.service";

@Component({
  selector: 'app-blocage-saisie-attribution',
  templateUrl: './blocage-saisie-attribution.component.html',
  styleUrls: ['./blocage-saisie-attribution.component.scss']
})
export class BlocageSaisieAttributionComponent extends TransitionAttributionComponent implements OnInit {

  constructor(public router: Router,
    public _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public attributionService: SdAttributionService,
    public attributionSourceService: CessionSourceService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public professionService: ProfessionService,
              public motifRejetService: MotifRejetService,
    public categoriePieceService: CategoriePieceService,
    public parcelleService: ParcelleService,
    public documentTypeService: DocumentTypeService
  ) {
    super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver, fb, attributionService, attributionSourceService, acteurService, contribuableService, professionService, categoriePieceService,parcelleService,documentTypeService);

    this.formulaire =this.fb.group({
      numero: [null, [Validators.required]],
      motifRejet:[null,[Validators.required]],
      action: [null, [Validators.required]],
      dossier : this.fb.group({
        observation: [null]
      }),
    });
  }

  ngOnInit(): void {
    this.formulaire.patchValue({
      numero: this.attribution.numero,
      action: this.transition.code
    });
    this.MotifRejetRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.motifRejetService);
  }

  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }
    this.loadingEvent.emit(true);
    let {numero,action,motifRejet}=this.formulaire.value;
    let {observation}=this.formulaire.value.dossier;
    let dataPost= {
      numero,action,observation,motifRejet
    };
    this.attributionService.executer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteInfo("Exécution effectuée avec succès", this._snackBar);
        this.router.navigate([environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_ATTRIBUTION]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );

  }
  resetForm(){

    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_ATTRIBUTION}`]);
  /*  if(this.planCadastral.numero) {
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_ATTRIBUTION}`]);
    }else {
      this.formulaire.reset();
    } */
  }
}
