import {Component, OnInit} from '@angular/core';
import {
  FlexModule,
  MediaObserver
} from "@angular/flex-layout";
import {
  FormBuilder,
  FormsModule,
  Validators
} from "@angular/forms";
import {GenericsFormModule} from "@sycadShared/form-components/generic-form.module";
import {MatButtonModule} from "@angular/material/button";
import {
  TransitionSdDelivranceComponent
} from "@sycadFeature/e-titres/saisie-differee-delivrance-aap/edition-sd-delivrance/transition-sd-delivrance-aap.component";
import {
  AdvancedRemoteAutocomplete
} from "@sycadShared/form-components/data-references-domaine/field-remote-autocomplete/advanced-remote-autocomplete";
import {
  GeneralContribuable
} from "@sycadApp/models/data-references/contribuables/global.model";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  AppConfirmService
} from "@sycadShared/app-confirm/app-confirm.service";
import {DateAdapter} from "@angular/material/core";
import {
  SdDelivranceAapService
} from "@sycadApp/services/workflow/sd-delivrance-aap.service";
import {
  ActeursService
} from "@sycadApp/services/data-references/contribuables/acteurs.service";
import {
  ContribuableService
} from "@sycadApp/services/data-references/system/contribuable.service";
import {
  ProfessionService
} from "@sycadApp/services/data-references/system/profession.service";
import {
  CategoriePieceService
} from "@sycadApp/services/data-references/system/categorie-piece.service";
import {
  StructureService
} from "@sycadApp/services/data-references/organigramme/structure.service";
import {
  ParcelleService
} from "@sycadApp/services/cession-parcelle/parcelle.service";
import {
  DestinationParcelleService
} from "@sycadApp/services/bornage/destination-parcelle.service";
import {
  environment
} from "../../../../../../environments/environment";
import {SycadUtils} from "@sycadShared/utils.functions";
import { UserProfilAttributionService } from '@sycadApp/services/data-references/system/user-profil-attribution.service';
import { SdAttributionService } from '@sycadApp/services/workflow/sd-attribution.service';
import { EnteteDossierService } from '@sycadApp/services/workflow/entete.service';
import { MandatService } from '@sycadApp/services/workflow/mandat.service';
import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';

@Component({
  selector: 'app-valider-sd-delivrance-aap',
  templateUrl: './valider-sd-delivrance-aap.component.html',
  styleUrls: ['./valider-sd-delivrance-aap.component.scss']
})
export class ValiderSdDelivranceAapComponent extends TransitionSdDelivranceComponent implements OnInit {

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
    super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver, fb, delivranceAapService, acteurService, contribuableService, professionService, categoriePieceService, structureService,parcelleService, destinationParcelleService, userProfilAttributionService, sdAttributionService, enteteDossierService, mandatService,authService);
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
      numero: this.delivranceAap.numero,
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
    this.delivranceAapService.executer(dossier).subscribe(data => {
        this.loadingEvent.emit(false);
        if(this.transition.code ==="DELIVRANCE_ATTESTATION_ATTRIBUTION_PARCELLE_ATTENTE_SIGNATURE_TO_VALIDE" ){
          this.openSnackBar("Le dossier à bien été validé","OK");
        }else{
          this.openSnackBar("Le dossier à bien été Mis à jour","OK");
        }
        

        if(this.transition.code ==="DELIVRANCE_ATTESTATION_ATTRIBUTION_PARCELLE_ATTENTE_SIGNATURE_TO_VALIDE" 
          || this.transition.code === "DELIVRANCE_ATTESTATION_ATTRIBUTION_PARCELLE_DRAFT_ACTE_TO_DRAFT_ACTE"
          || this.transition.code === "DELIVRANCE_ATTESTATION_ATTRIBUTION_PARCELLE_DEPOSE_TO_DRAFT_ACTE"
          || this.transition.code === "DELIVRANCE_ATTESTATION_ATTRIBUTION_PARCELLE_BROUILLON_TO_DRAFT_ACTE"){
          this.router.navigate([environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DELIVRANCE_AAP+"/view/"+this.formulaire.value.numero], { queryParams: { tab: 0.2 } });
        }else{
          this.router.navigate([environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DELIVRANCE_AAP+"/view/"+this.formulaire.value.numero]);
        }

      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );

  }
  resetForm(){
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DELIVRANCE_AAP}`]);
  }


}
