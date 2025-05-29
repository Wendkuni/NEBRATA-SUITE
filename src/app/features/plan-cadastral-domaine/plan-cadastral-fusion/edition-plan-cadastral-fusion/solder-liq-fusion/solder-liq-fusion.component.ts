import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DossierContributionFonciere } from '@sycadApp/models/impot/contribution-fonciere.model';
import { Impot } from '@sycadApp/models/impot/mode-reglement.model';
import { CategoriePieceProcessus } from '@sycadApp/models/workflow/common/general';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { ActeursService } from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { ContribuablePhysiqueService } from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';
import { StructureService } from '@sycadApp/services/data-references/organigramme/structure.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';
import { ContributionFonciereService } from '@sycadApp/services/impot/contribution-fonciere.service';
import { ExerciceFiscaleService } from '@sycadApp/services/impot/exercice-fiscale.service';
import { PlanCadastralFusionnementService } from '@sycadApp/services/workflow/common/fusionnement.service';
import { PlanCadastralMorcellementService } from '@sycadApp/services/workflow/common/morcellement.service';
import { MandatService } from '@sycadApp/services/workflow/mandat.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { environment } from 'environments/environment';
import { of } from 'rxjs';
import { TransitionPlanCadastralFusionnement } from '../transition-fusion.component';

@Component({
  selector: 'app-solder-liq-fusion',
  templateUrl: './solder-liq-fusion.component.html',
  styleUrls: ['./solder-liq-fusion.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SolderLiqFusionComponent  extends TransitionPlanCadastralFusionnement implements OnInit {

  constructor(
    public dialog: MatDialog,
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
    public parcelleService: ParcelleService, public mandatService: MandatService) {
      super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService, fusionService,
        acteurService, contribuableService, structureService, parcelleService, mandatService);
    this.formulaire =this.fb.group({
      numero: [null, [Validators.required]],
      action: [null, [Validators.required]]
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
      numero: this.fusion.numero,
      action: this.transition.code
    });
  }


  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }
    

    this.loadingEvent.emit(true);
  

    this.fusionService.executer(this.formulaire.value).subscribe(data => {
      this.loadingEvent.emit(false);
        this.openSnackBar("Liquidation mise à jour avec succès", "OK");
        this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_FUSION]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }

}
