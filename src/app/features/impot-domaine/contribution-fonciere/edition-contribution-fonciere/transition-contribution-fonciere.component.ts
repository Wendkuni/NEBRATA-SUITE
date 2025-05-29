import { Directive, Input, ViewChild } from "@angular/core";
import { MediaObserver } from "@angular/flex-layout";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import {
  MatDialog,
  MatDialogRef
} from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { ParcelleElement } from "@sycadApp/models/data-references/territoire/localite.model";
import { DossierPiece, Mandat, Processus, Transition } from "@sycadApp/models/workflow/common/general";
import { ParcelleService } from "@sycadApp/services/cession-parcelle/parcelle.service";
import { CategoriePieceService } from "@sycadApp/services/data-references/system/categorie-piece.service";
import { AppConfirmService } from "@sycadApp/shared/app-confirm/app-confirm.service";
import { AdvancedRemoteAutocomplete } from "@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/advanced-remote-autocomplete";
import { TransitionComponent } from "@sycadApp/shared/form-components/processus/transition/component.transition";
import { Observable, of, Subject } from "rxjs";
import { environment } from "environments/environment";
import { MandatService } from "@sycadApp/services/workflow/mandat.service";
import { catchError, map } from "rxjs/operators";
import { TypeColonne } from "@sycadApp/libs/model-table";
import { DossierContributionFonciere } from "@sycadApp/models/impot/contribution-fonciere.model";
import { ContribuablePhysiqueService } from "@sycadApp/services/data-references/contribuables/contribuable-physique.service";
import { GeneralContribuable } from "@sycadApp/models/data-references/contribuables/global.model";
import { ContributionFonciereService } from "@sycadApp/services/impot/contribution-fonciere.service";
import { ContribuablePhysiqueAutocomplete, ContribuablePhysiqueItem } from "@sycadApp/models/data-references/contribuables/contribuable-physique.model";
import { RemoteAutocomplete } from "@sycadApp/shared/form-components/model/remote-autocomplete";
import { CalendrierFiscale, ExerciceFiscale } from "@sycadApp/models/impot/exercice-fiscale.model";
import { ExerciceFiscaleService } from "@sycadApp/services/impot/exercice-fiscale.service";
import { Impot, ValeurElementLiquidation } from "@sycadApp/models/impot/mode-reglement.model";
import {
  RapideContribuableFormComponent
} from "@sycadShared/form-components/annuaire-identite/rapide-contribuable-form/rapide-contribuable-form.component";
import {
  CessionSourceType
} from "@sycadApp/models/workflow/common/attribution-source.model";
import {
  ContribuableService
} from "@sycadApp/services/data-references/system/contribuable.service";

@Directive()
export class TransitionContributionFonciereComponent extends TransitionComponent{

    @Input()
  public contributionFonciere: DossierContributionFonciere;

  @Input()
  public transition: Transition;

  @Input()
  public processus: Processus;



  public mandatRemoteAutocomplete = new AdvancedRemoteAutocomplete<Mandat>();
  public contribuableRemoteAutocomplete = new AdvancedRemoteAutocomplete<GeneralContribuable>();
  public exerciceFiscaleRemoteAutocomplete = new RemoteAutocomplete<ExerciceFiscale>();
  public calendrierFiscaleRemoteAutocomplete = new RemoteAutocomplete<CalendrierFiscale>();

  get objet() { return this.formulaire.get('dossier').get('objet'); }
  get observation() { return this.formulaire.get('dossier').get('observation'); }

  get dossier() { return this.formulaire.get('dossier'); }
  get parcelle() { return this.formulaire.get('parcelle'); }
  get valeurDeclare() { return this.formulaire.get('valeurDeclare'); }
  get pieces() { return this.formulaire.controls.pieces as FormArray; }
  get contribuable() { return this.formulaire.get('contribuable'); }
  get documents() { return this.formulaire.controls.documents as FormArray; }
  get exerciceFiscale() { return this.formulaire.get('exerciceFiscale'); }
  get calendrierFiscale() { return this.formulaire.get('calendrierFiscale'); }
  get impots() { return this.formulaire.controls.impots as FormArray; }


  public callbackAutocompleteParcelleByIlotByOwn:(search:string,params:Map<string,any>)=>Observable<any[]>;
  public callbackAutocompleteParcelleByIlotByConnected:(search:string,params:Map<string,any>)=>Observable<any[]>;
  public callbackAutocompleteParcelleByIlotByMandat:(search:string,params:Map<string,any>)=>Observable<any[]>;
  public dialogRefRapideContribuableForm: MatDialogRef<RapideContribuableFormComponent,any>;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public contributionFonciereService: ContributionFonciereService,
    public contribuablePhysiqueService: ContribuablePhysiqueService,
    public parcelleService: ParcelleService,
    public exerciceFiscaleService: ExerciceFiscaleService,
    public mandatService: MandatService,
  ) {
    super(mediaObserver);

    this.formulaire = this.fb.group({
      dossier: this.fb.group({
        objet: [null, [Validators.required]],
        observation: [null],
      }),
      contribuable: [null],
      exerciceFiscale:  [null, Validators.compose([Validators.required])],
      valeurDeclare:  [null, Validators.compose([Validators.required])],
      calendrierFiscale:  [null, Validators.compose([Validators.required])],
      parcelle: [null, Validators.compose([Validators.required])],
      pieces: new FormArray([]),
      documents: new FormArray([]),
      impots: new FormArray([]),
      mandat: [null],
    //  mandats: new FormArray([]),
    });

    this.callbackAutocompleteParcelleByIlotByOwn=(search:string,params:Map<string,any>)=> {
      return this.parcelleService.autocompletionByIlot(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };

    this.callbackAutocompleteParcelleByIlotByConnected=(search:string,params:Map<string,any>)=> {
      return this.parcelleService.autocompletionByIlotByConnected(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };

    this.callbackAutocompleteParcelleByIlotByMandat=(search:string,params:Map<string,any>)=> {
      return this.parcelleService.autocompletionByIlotByMandat(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };
  }

  /**************** impot *********************/
  createValeurElementLiquidations(valeurElementLiquidation: ValeurElementLiquidation) {

   let form=this.fb.group({
    id: [valeurElementLiquidation.id],
    observation: [valeurElementLiquidation.observation],
    taux: [valeurElementLiquidation.taux],
    baseImpot: [valeurElementLiquidation.baseImpot],

  });


    return form;

  }
  createImpot(impot: Impot) {


    let valeurElementLiquidations = new FormArray([]);
    if (impot.valeurElementLiquidations) {
      impot.valeurElementLiquidations.map((vel) => {
        valeurElementLiquidations.insert(0, this.createValeurElementLiquidations(vel));
    });
    }

    let form=this.fb.group({
      id: [impot.id],
      observation: [impot.observation],
      typeDroit: [impot.typeDroit],
      libelleCourt: [impot.natureImpot.libelleCourt],
      valeurElementLiquidations: valeurElementLiquidations,
    });



    return form;

  }
  addNewImpot(impot: Impot) {
    this.impots.insert(0, this.createImpot(impot));

  }


  removeImpot(index) {
    this.impots.removeAt(index);
  }
  /**************** fin impot *********************/

  /**************** piece officielle *********************/

  createDossierPiece(piece: DossierPiece = null) {

    if (piece != null) {


      return this.fb.group({
        id: [piece.id],
        categorie: [piece.categorie, Validators.compose([Validators.required])],
        reference: [piece.reference],
        dateExpiration: [piece.dateExpiration],
        dateDelivrance: [piece.dateDelivrance],
        autoriteDeDelivrance: [piece.autoriteDeDelivrance],
        observation: [piece.observation],
        pieceJointe: [piece.pieceJointe],
      });
    } else {
      return this.fb.group({
        id: [null],
        categorie: [null, Validators.compose([Validators.required])],
        reference: [null],
        dateExpiration: [null],
        dateDelivrance: [null],
        autoriteDeDelivrance: [null],
        observation: [null],
        pieceJointe: null,
      });
    }

  }
  addNewDossierPiece() {
    this.pieces.insert(0, this.createDossierPiece());

  }


  removeDossierPiece(index) {
    this.pieces.removeAt(index);
  }
  /**************** fin piece officielle *********************/


  public onSearchCalendrierFiscale(eventNgSelect) {
    this.calendrierFiscaleRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onChangeCalendrierFiscale(calendrierFiscale: CalendrierFiscale) {

  }

  public onSearchExerciceFiscale(eventNgSelect) {
    this.exerciceFiscaleRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onChangeExerciceFiscale(exerciceFiscale: ExerciceFiscale) {

  }

  public contribuableChoisie: GeneralContribuable;

  receiveSubjectContribuable(contri: GeneralContribuable) {
    this.contribuableChoisie = contri;
    this.parcelle.setValue(null);
    this.parcelleChoisie = null;
  }





  public parcelleChoisie: ParcelleElement;

  public mandatChoisie: Mandat;

  receiveSubjectMandat(mandat: Mandat) {
     this.mandatChoisie= mandat;
     if(mandat) {
       this.contribuableChoisie=mandat.mandant;
       this.contribuable.setValue(mandat.mandant.guid);
     }else {
      this.contribuableChoisie=null;
      this.contribuable.setValue(null);
     }
     this.parcelle.setValue(null);
     this.parcelleChoisie=null;
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }

  receiveSubjectContribuableBeneficiaire(contri: GeneralContribuable) {
    this.contribuableChoisie = contri;

    this.parcelle.setValue(null);
  }

  initConfigAutocompleteMandat() {

    let callbackAutocomplete = (search:string,params:Map<string,any>)=> {
      return this.mandatService.autocompletionByMesMandats(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };

    this.mandatRemoteAutocomplete.customNgSelectConfig = {
      multiple: false,
      controlName: 'mandat',
      libelle: 'objet',
      term: new Subject<string>(),
      callbackAutocomplete: callbackAutocomplete,
      formulaire: this.formulaire,
      placeholder: "Le mandat associé à ce dossier"
    };

    this.mandatRemoteAutocomplete.nativeNgSelectConfig.placeholder = "Le mandat associé à ce dossier";
    this.mandatRemoteAutocomplete.nativeNgSelectConfig.appendTo = 'body';
    this.mandatRemoteAutocomplete.nativeNgSelectConfig.bindValue = 'id';
    this.mandatRemoteAutocomplete.listItemSelected = [];
    this.mandatRemoteAutocomplete.keyId = 'id';
    this.mandatRemoteAutocomplete.callbackAutocomplete = callbackAutocomplete;
    const colTabAttributaire = [
      { name: 'objet', label: 'Objet' },
      { name: 'reference', label: 'Référence' },
      { name: 'mandant.libelle', label: 'Mandant' },
      { name: 'mandataire.libelle', label: 'Mandataire' },
      { name: 'debut', label: 'Début',type:TypeColonne.DATE },
      { name: 'fin', label: 'Fin',type:TypeColonne.DATE },
    ];
    this.mandatRemoteAutocomplete.tableDescription = this.mandatRemoteAutocomplete.pushColumn(colTabAttributaire, 'Tableau de mes mandats');

  }

  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_CONTRIBUTION_FONCIERE}`]);
  }


  private getCorrectWidth() {

    if(this.mediaObserver.isActive("xs")) {
      return {
        width: '95vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("sm")) {
      return {
        width: '90vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("md")) {
      return {
        width: '90vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("lg")) {
      return {
        width: '90vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }
    if(this.mediaObserver.isActive("xl")) {
      return {
        width: '60vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }
  }

}
