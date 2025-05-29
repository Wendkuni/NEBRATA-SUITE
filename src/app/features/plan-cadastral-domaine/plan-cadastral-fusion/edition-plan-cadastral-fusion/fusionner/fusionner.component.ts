import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {TransitionPlanCadastralFusionnement} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-fusion/edition-plan-cadastral-fusion/transition-fusion.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {MediaObserver} from '@angular/flex-layout';
import {
  FormBuilder,
  Validators
} from '@angular/forms';
import {CategoriePieceService} from '@sycadApp/services/data-references/system/categorie-piece.service';
import {PlanCadastralFusionnementService} from '@sycadApp/services/workflow/common/fusionnement.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import {ContribuableService} from '@sycadApp/services/data-references/system/contribuable.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {MandatService} from '@sycadApp/services/workflow/mandat.service';
import {environment} from '../../../../../../environments/environment';
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-fusionner',
  templateUrl: './fusionner.component.html',
  styleUrls: ['./fusionner.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FusionnerComponent extends TransitionPlanCadastralFusionnement implements OnInit {

  get libelle(){return this.formulaire.get('libelle');}
  get superficie(){return this.formulaire.get('superficie');}
  constructor(public dialog: MatDialog,
              public router: Router,
              public _snackBar: MatSnackBar,
              public confirmService: AppConfirmService,
              public _adapter: DateAdapter<any>,
              public mediaObserver: MediaObserver,
              public fb: FormBuilder,
              public categoriePieceService: CategoriePieceService,
              public fusionService: PlanCadastralFusionnementService,
              public acteurService: ActeursService,
              public contribuableService: ContribuableService,
              public structureService: StructureService,
              public parcelleService: ParcelleService, public mandatService: MandatService)
  {
    super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService, fusionService,
      acteurService, contribuableService, structureService, parcelleService, mandatService);

      this.formulaire = this.fb.group({
      numero: [null, [Validators.required]],
      action: [null, [Validators.required]],
      parcelle: [null, [Validators.required]],
      libelle:[null, [Validators.required]],
      superficie: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this._adapter.setLocale('fr');
      //this.parcellesChoisies = this.fusion.parcelles;
    this.formulaire.patchValue({
      numero: this.fusion.numero,
      action: this.transition.code,
       parcelle: this.fusion.parcelle.id,
        libelle: this.fusion.parcelle.libelle,
        superficie: this.fusion.parcelle.superficie
    });
  }
  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }

    this.loadingEvent.emit(true);
    let {action, numero, parcelles, parcelle,libelle,superficie} = this.formulaire.value;
    let dataPost = {parcelles, action, numero, parcelle,libelle,superficie}
    this.fusionService.executer(dataPost).subscribe(data => {
        this.loadingEvent.emit(false);
        this.openSnackBar('Dossier de fusionnement modifié avec succès', 'OK');
        this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_FUSION]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );
  }
}
