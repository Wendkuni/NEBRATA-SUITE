import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {MediaObserver} from '@angular/flex-layout';
import {CategoriePieceService} from '@sycadApp/services/data-references/system/categorie-piece.service';
import {PlanCadastralMorcellementService} from '@sycadApp/services/workflow/common/morcellement.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import {ContribuableService} from '@sycadApp/services/data-references/system/contribuable.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {MandatService} from '@sycadApp/services/workflow/mandat.service';
import {ParcelleElement} from '@sycadApp/models/data-references/territoire/localite.model';
import {TransitionDomaineMorcellementComponent} from '@sycadApp/features/plan-cadastral-domaine/plan-cadastral-morcellement/edition-domaine-morcellement/transition-domaine-morcellement.component';
import {environment} from '../../../../../../environments/environment';
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-morceler',
  templateUrl: './morceler.component.html',
  styleUrls: ['./morceler.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MorcelerComponent extends TransitionDomaineMorcellementComponent implements OnInit {

 

  constructor(public dialog: MatDialog,
              public router: Router,
              public _snackBar: MatSnackBar,
              public confirmService: AppConfirmService,
              public _adapter: DateAdapter<any>,
              public mediaObserver: MediaObserver,
              public fb: FormBuilder,
              public categoriePieceService: CategoriePieceService,
              public morcellementService: PlanCadastralMorcellementService,
              public acteurService: ActeursService,
              public contribuableService: ContribuableService,
              public structureService: StructureService,
              public parcelleService: ParcelleService, public mandatService: MandatService) {
    super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService, morcellementService,
      acteurService, contribuableService, structureService, parcelleService, mandatService);

    this.formulaire = this.fb.group({
      numero: [null, [Validators.required]],
      action: [null, [Validators.required]],
      parcelles: new FormArray([])
    });
  }

  ngOnInit(): void {
    this.formulaire.patchValue({
      numero: this.morcellement.numero,
      action: this.transition.code
    });

    if (this.morcellement?.parcelles) {
      this.morcellement.parcelles.map((parcelle) => {
        this.parcelles.insert(0, this.createParcelle(parcelle));
      });
    }
  }

  /**************** parcelle form  *************  ********/



  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }

    this.loadingEvent.emit(true);
    let {action, numero, parcelles } = this.formulaire.value;
    let dataPost = {parcelles, action, numero}
    this.morcellementService.executer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
        this.openSnackBar('Dossier de morcellment modifié avec succès', 'OK');
        this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MORCELLEMENT]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );
  }

}
