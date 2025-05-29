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
import { ContribuablePhysiqueService } from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';
import { ContributionFonciereService } from '@sycadApp/services/impot/contribution-fonciere.service';
import { ExerciceFiscaleService } from '@sycadApp/services/impot/exercice-fiscale.service';
import { MandatService } from '@sycadApp/services/workflow/mandat.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { environment } from 'environments/environment';
import { of } from 'rxjs';
import { TransitionContributionFonciereComponent } from '../transition-contribution-fonciere.component';


@Component({
  selector: 'app-calcul-cf',
  templateUrl: './calcul-cf.component.html',
  styleUrls: ['./calcul-cf.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CalculCFComponent extends TransitionContributionFonciereComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public contributionFonciereService: ContributionFonciereService,
    public contribuablePhysiqueService: ContribuablePhysiqueService,
    public exerciceFiscaleService: ExerciceFiscaleService,
    public parcelleService: ParcelleService, public mandatService: MandatService) {
    super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver, fb,contributionFonciereService,contribuablePhysiqueService,parcelleService,exerciceFiscaleService,mandatService);
  
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
      numero: this.contributionFonciere.numero,
      action: this.transition.code
    });

    //ajout de l'impot unique de type CD
  let titreRecette=this.contributionFonciere.titresRecette[0];
   
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
  

    this.contributionFonciereService.executer(this.formulaire.value).subscribe(data => {
      this.loadingEvent.emit(false);
        this.openSnackBar("Contribuable foncière mise à jour avec succès", "OK");
        this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_CONTRIBUTION_FONCIERE]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }


}
