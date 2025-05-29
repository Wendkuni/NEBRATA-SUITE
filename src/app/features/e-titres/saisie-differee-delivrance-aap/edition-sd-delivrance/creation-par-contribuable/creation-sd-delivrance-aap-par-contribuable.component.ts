import { TransitionSdDelivranceComponent } from '../transition-sd-delivrance-aap.component';
import { Component, Input, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { CategoriePieceProcessus, Mandat } from '@sycadApp/models/workflow/common/general';
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
import { of } from 'rxjs';
import { DestinationParcelleService } from '@sycadApp/services/bornage/destination-parcelle.service';
import { UserProfilAttributionService } from '@sycadApp/services/data-references/system/user-profil-attribution.service';
import { SdAttributionService } from '@sycadApp/services/workflow/sd-attribution.service';
import { EnteteDossierService } from '@sycadApp/services/workflow/entete.service';
import { AttributionParcelle } from '@sycadApp/models/workflow/sd-attribution.model';
import { MandatService } from '@sycadApp/services/workflow/mandat.service';
import { AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';
import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';

@Component({
  selector: 'pc-creation-sd-delivrance-aap-par-contribuable',
  templateUrl: './creation-sd-delivrance-aap-par-contribuable.component.html',
  styleUrls: ['./creation-sd-delivrance-aap-par-contribuable.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreationSdDelivranceAapParContribuableComponent extends TransitionSdDelivranceComponent implements OnInit {
  mandataire: any;
  @Input("authentificatedUser")
  public authentificatedUser: AuthentificatedUser;
  
  public guidProprietaire: string;

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
 
    this.formulaire.get('mandats').statusChanges.subscribe(status => {
      if (this.formulaire.get('mandats').touched) {
        this.onchangeFormMandat();
      }
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
    this.delivranceAap = new DelivranceAap();

    this.categoriePieceProcessus$ = this.processus.categoriePieces;
    this.categorieIdentiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.categoriePieceService);
    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.structureService);
    this.initConfigAutocompleteActeur();
    this.initConfigAutocompleteAttributaire();

    this.typeDocuments=this.processus.typeDocuments;
    
    this.destinationRemoteAutocomplete.listRessource$=of(this.lesDestinations);
    this.destinationRemoteAutocomplete.initialList=this.lesDestinations;
    

    this.initConfigAutocompleteMandat();
    this.destinationRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.destinationParcelleService);
    

        this.authService.getMe().subscribe((ob) => {
          this.authentificatedUser=ob;
         });
         
  }

  

  receiveSubjectMandat(mandat: Mandat) {
    this.mandatChoisie= mandat;
    if(mandat) {
      this.contribuableBeneficiaireChoisie=mandat.mandant;
      this.guidProprietaire=mandat.mandant.guid;
    }else {
     this.contribuableBeneficiaireChoisie=null;
     this.guidProprietaire=this.authentificatedUser.guid;
   
    }
    this.parcelleChoisie=null;
    this.parcelle.setValue(null);
 }
  

  public onSearchDestination(eventNgSelect){
    this.destinationRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchCategoriePiece(eventNgSelect) {
    this.categorieIdentiteRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public categoriePieceProcessus$: CategoriePieceProcessus[] = [];
  public idCategoriePieceListChosen$: number[] = [];
  public changeCategoriePiece(data: CategoriePieceProcessus) {
    this.idCategoriePieceListChosen$ = [];
    for (let i = 0; i < this.pieces.length; i++) {
      let piece = this.pieces.at(i);
      this.idCategoriePieceListChosen$.push(piece.value.categorie);
    }
    let that = this;
    this.categoriePieceProcessus$ = this.processus.categoriePieces.filter((piece) => {
      return (that.idCategoriePieceListChosen$.indexOf(piece.id) < 0);
    });

  }

  addNewDossierPiece() {
    if (this.categoriePieceProcessus$.length > 0) {
      super.addNewDossierPiece();
    }
  }

  removeDossierPiece(i) {
    super.removeDossierPiece(i);
    this.changeCategoriePiece(null);
  }
  onSubmit() {

    if (!this.formulaire.valid) {
      return false;
    }
   this.loadingEvent.emit(true);
   
   if(this.parcelleInexistantechoix == true){
    this.formulaire.patchValue({
      parcelle: null
    })
   }else{
    this.formulaire.patchValue({
      parcelleInexistante: null
    })
   }

    let { dossier, contribuableBeneficiaire, documentType, mandats, parcelle, pieces, documents, dateDepot, dateDemande, quittances, informationParcelle, parcelleInexistante} = this.formulaire.value;
   
   
    let tmp = {contribuableBeneficiaire, documentType, parcelle, pieces, documents, mandats, dateDepot, dateDemande, quittances, informationParcelle, parcelleInexistante};
    let dataPost = { ...dossier, ...tmp };
    this.delivranceAapService.creer(dataPost).subscribe(data => {
    
      const dossier: DelivranceAap = data as DelivranceAap;
      this.loadingEvent.emit(false);
      this.openSnackBar("Dossier ajoutée avec succès", "OK");
      this.router.navigate([environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DELIVRANCE_AAP+"/view/"+dossier.numero]);
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
