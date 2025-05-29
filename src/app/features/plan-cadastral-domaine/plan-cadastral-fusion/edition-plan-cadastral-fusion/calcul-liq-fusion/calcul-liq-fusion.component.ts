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
import { PlanCadastralFusionnementService } from '@sycadApp/services/workflow/common/fusionnement.service';
import { PlanCadastralMorcellementService } from '@sycadApp/services/workflow/common/morcellement.service';
import { MandatService } from '@sycadApp/services/workflow/mandat.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { environment } from 'environments/environment';
import { of } from 'rxjs';
import { TransitionPlanCadastralFusionnement } from '../transition-fusion.component';

@Component({
  selector: 'app-calcul-liq-fusion',
  templateUrl: './calcul-liq-fusion.component.html',
  styleUrls: ['./calcul-liq-fusion.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CalculLiqFusionComponent extends TransitionPlanCadastralFusionnement implements OnInit {

 
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
      action: [null, [Validators.required]],
      impots: new FormArray([]),
    });
  }


  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  public listImpotData: Map<number,Impot>= new Map<number,Impot>();
 
  getValueImpot(impotForm: FormGroup) {  
      return this.listImpotData.get(impotForm.get('id').value);
  }
  ngOnInit(): void {

    this.formulaire.patchValue({
      numero: this.fusion.numero,
      action: this.transition.code
    });

    //ajout de l'impot unique de nature code=98
  let titreRecette=null;
  if(this.fusion.titresRecette && this.fusion.titresRecette.length>0) {
    titreRecette=this.fusion.titresRecette[0];
  }
   
 //// console.log("titreRecette.impots",titreRecette.impots);
 if(titreRecette && titreRecette.impots) {
  for (let i = 0; i < titreRecette.impots.length; i++) {
    let impot = titreRecette.impots[i];
    if(impot.id>0){
      this.listImpotData.set(impot.id,impot);
    }
    this.addNewImpot(impot);
    //
  }
 }
 
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
