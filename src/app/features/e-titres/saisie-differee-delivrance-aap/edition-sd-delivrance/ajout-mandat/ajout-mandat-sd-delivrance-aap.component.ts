import { TransitionSdDelivranceComponent } from './../transition-sd-delivrance-aap.component';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '@sycadShared/app-confirm/app-confirm.service';
import { DateAdapter } from '@angular/material/core';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import { SycadUtils } from '@sycadShared/utils.functions';
import {Document} from '@sycadApp/models/workflow/common/general';
import { CategoriePieceProcessus } from '@sycadApp/models/workflow/common/general';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { SdDelivranceAapService } from '@sycadApp/services/workflow/sd-delivrance-aap.service';
import { DelivranceAap } from '@sycadApp/models/workflow/sd-delivrance-aap.model';
import { ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';
import { ArrondissementElement } from '@sycadApp/models/data-references/territoire/arrondissement.model';
import { SaisieDiffereeAttributionContexteElement } from '@sycadApp/models/workflow/sd-saisie-differee-attribution-contexte.model';
import { EtatAttribution, GeneralContribuable } from '@sycadApp/models/data-references/contribuables/global.model';
import { of } from 'rxjs';
import { AdvancedRemoteAutocomplete } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/advanced-remote-autocomplete';
import { DestinationParcelleService } from '@sycadApp/services/bornage/destination-parcelle.service';
import { UserProfilAttributionService } from '@sycadApp/services/data-references/system/user-profil-attribution.service';
import { SdAttributionService } from '@sycadApp/services/workflow/sd-attribution.service';
import { EnteteDossierService } from '@sycadApp/services/workflow/entete.service';
import { MandatService } from '@sycadApp/services/workflow/mandat.service';
import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';

@Component({
  selector: 'app-ajout-mandat-sd-delivrance-aap',
  templateUrl: './ajout-mandat-sd-delivrance-aap.component.html',
  styleUrls: ['./ajout-mandat-sd-delivrance-aap.component.scss']
})
export class AjoutMAndatSdDelivranceAapComponent extends TransitionSdDelivranceComponent implements OnInit {

  public attributaireRemoteAutocomplete = new AdvancedRemoteAutocomplete<GeneralContribuable>();
  public icad:string = "";


  constructor(
    public dialog: MatDialog,
    public router: Router,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public delivranceAapService: SdDelivranceAapService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public professionService: ProfessionService,
    public categoriePieceService: CategoriePieceService,
    public structureService: StructureService,
    public parcelleService: ParcelleService,
    public destinationParcelleService: DestinationParcelleService,
    public userProfilAttributionService: UserProfilAttributionService,
    public sdAttributionService: SdAttributionService,
    public enteteDossierService: EnteteDossierService,
    public mandatService: MandatService,
    public authService: AuthenticationService) {
    super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver, fb, delivranceAapService, acteurService, contribuableService, professionService, categoriePieceService, structureService,parcelleService, destinationParcelleService, userProfilAttributionService, sdAttributionService, enteteDossierService, mandatService, authService);
    this.formulaire = this.fb.group({
      numero: [null, [Validators.required]],
      action: [null, [Validators.required]],
      mandats: this.fb.array([]),
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
  
  
    this.initConfigAutocompleteContribuablequiretireletitre();
    this.formulaire.patchValue({
      numero: this.delivranceAap.numero,
      action: this.transition.code,
      
    });
    let contribuablequiretireletitreList: GeneralContribuable[];
    contribuablequiretireletitreList = [
      this.delivranceAap.contribuableBeneficiaire, 
      ...this.delivranceAap.mandats.map(mandat => mandat.mandataire)
    ];
    this.contribuablequiretireletitreRemoteAutocomplete.initialList = contribuablequiretireletitreList;
  }
  test(){
    console.log(this.formulaire)
  }
  onSubmit() {

    if (!this.formulaire.valid) {
      return false;
    }
    this.loadingEvent.emit(true);
    let { mandats, numero, action } = this.formulaire.value;
    let tmp = { mandats, action, numero };
    let dataPost = { ...tmp };
    this.delivranceAapService.executer(dataPost).subscribe(data => {
        this.loadingEvent.emit(false);
        this.openSnackBar("Le mandat a bien été ajouté", "OK");

        this.router.navigate([environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DELIVRANCE_AAP+"/view/"+this.formulaire.value.numero], { queryParams: { tab: 2.1 } });
       
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );

  }
  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DELIVRANCE_AAP}`]);
  }


}
