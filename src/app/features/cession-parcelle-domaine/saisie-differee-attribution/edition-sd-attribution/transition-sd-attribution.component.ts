
import {Input, Directive, ViewChild} from '@angular/core';

import { Validators, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  CessionParcelle,
  Document,
  DossierPiece,
  Mandat,
  Processus,
  Transition
} from '@sycadApp/models/workflow/common/general';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { DateAdapter } from '@angular/material/core';
import { MediaObserver } from '@angular/flex-layout';
import { IlotElement, IlotItem, ParcelleAutocomplete, ParcelleElement, ParcelleInexistante } from '@sycadApp/models/data-references/territoire/localite.model';

import { AttributionParcelle } from '@sycadApp/models/workflow/sd-attribution.model';

import { ActeurAutocomplete } from '@sycadApp/models/data-references/contribuables/acteur.model';
import {
  CategoriePiece,
  ContribuableElement,
  GeneralContribuable,
  Ilot,
  Section
} from '@sycadApp/models/data-references/contribuables/global.model';
import { CessionSource } from '@sycadApp/models/workflow/common/attribution-source.model';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { SdAttributionService } from '@sycadApp/services/workflow/sd-attribution.service';
import { CessionSourceService } from '@sycadApp/services/impot/cession-source.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';

import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { Observable, of, Subject } from 'rxjs';
import { ArrondissementAutocomplete } from '@sycadApp/models/data-references/territoire/arrondissement.model';
import { CommuneAutocomplete } from '@sycadApp/models/data-references/territoire/commune.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TransitionComponent } from '@sycadApp/shared/form-components/processus/transition/component.transition';
import { RapideContribuableFormComponent } from '@sycadApp/shared/form-components/annuaire-identite/rapide-contribuable-form/rapide-contribuable-form.component';
import { AdvancedRemoteAutocomplete } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/advanced-remote-autocomplete';
import { catchError, map } from 'rxjs/operators';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { TypeColonne } from '@sycadApp/libs/model-table';
import { RemoteAutocompleteCommuneZoneCompetence } from '@sycadApp/features/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence';
import {
  DocumentType
} from "@sycadApp/models/data-references/system/document-type.model";
import {
  DropzoneComponent,
  DropzoneConfigInterface
} from "ngx-dropzone-wrapper";
import {
  DocumentTypeService
} from "@sycadApp/services/data-references/system/document-type.service";
import {
  MotifRejetAutocomplete
} from "@sycadApp/models/data-references/system/motif-rejet.model";
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';

@Directive()
export class TransitionAttributionComponent extends TransitionComponent {


  @Input()
  public attribution: AttributionParcelle;

  @Input()
  public transition: Transition;

  @Input()
  public processus: Processus;

  parcelleInexistanteElement: ParcelleInexistante;

  public communeRemoteAutocomplete = new RemoteAutocompleteCommuneZoneCompetence<CommuneAutocomplete>();
  public MotifRejetRemoteAutocomplete = new RemoteAutocomplete<MotifRejetAutocomplete>();

  public isloading= false;

  documentDeSortie: FormGroup;
  public typeDocuments: DocumentType [];
  public listeAttributairesParcelleOccupe: (ContribuableElement | GeneralContribuable)[];
  selectedDocumentType: DocumentType[] = [];
  public dossierRetour : CessionParcelle[];
  get attributaire() { return this.formulaire.get('attributaire'); }
  public acteurRemoteAutocomplete = new AdvancedRemoteAutocomplete<ActeurAutocomplete>();
  public attributaireRemoteAutocomplete = new AdvancedRemoteAutocomplete<GeneralContribuable>();
  public categorieIdentiteRemoteAutocomplete = new RemoteAutocomplete<CategoriePiece>();
  public cessionSourceRemoteAutocomplte = new RemoteAutocomplete<CessionSource>();
  public documentTypeRemoteAutocomplete = new RemoteAutocomplete<DocumentType>();
  public isLoadingResults = false;
  public attributaireForm: FormGroup;

  public parcelleInexistantechoix: boolean = false;
  parcelleInexistantefacile: ParcelleInexistante = new ParcelleInexistante;
  get objet() {
    return this.dossier.get('objet');
  }
  get pieces() { return this.formulaire.controls.pieces as FormArray; }
  get documents() { return this.formulaire.controls.documents as FormArray; }
  get libelle(){return this.formulaire.get('document.0.libelle')}
  get numero(){return this.formulaire.get('document.0.numero')}
  get mandats() { return this.formulaire.controls.mandats as FormArray; }
  get dossier() { return this.formulaire.get('dossier'); }
  get parcelle() { return this.formulaire.get('parcelle'); }
  get acteur() { return this.formulaire.get('acteur'); }
  get cessionSource() { return this.formulaire.get('cessionSource'); }
  get dateDoc(){return this.formulaire.get('document.0.dateDoc')}
  get motifRejet(){return this.formulaire.get('motifRejet');}

  get parcelleInexistante(){return this.formulaire.get('parcelleInexistante');}

  public autocompletionByIlotAndLibre:(search:string,params:Map<string,any>)=>Observable<any[]>;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public attributionService: SdAttributionService,
    public attributionSourceService: CessionSourceService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public professionService: ProfessionService,
    public categoriePieceService: CategoriePieceService,
    public parcelleService: ParcelleService,
    public documentTypeService: DocumentTypeService,
  ) {
    super(mediaObserver);

    this.documentDeSortie = this.fb.group({
      id: [null],
      numero: [null,Validators.required],
      libelle: [null,Validators.required],
      pieceJointe: [null],
      documentType: [null],
      dateDoc: [null]
    });

    this.formulaire = this.fb.group({
      dossier: this.fb.group({
        etatDossier: [false],
        observation: [null],
      }),
      acteur: [null],
      cessionSource: [null, Validators.compose([Validators.required])],
      attributaire: [null, Validators.compose([Validators.required])],
      parcelle: [null, Validators.compose([Validators.required])],
      pieces: new FormArray([]),
      documentType:[null],
      documentDeSortie: this.documentDeSortie,
      mandats: new FormArray([]),
      numeroDePage: [null],
      numeroDePV: [null],
      parcelleInexistante: this.fb.group({
        id: [null],
        commune: [null],
        arrondissement: [null],
        localite: [null], // Si ce champ n'est pas obligatoire
        quartier: [null], // Idem pour ce champ
        section: [null],
        ilot: [null],
        numero: [null],
        superficie: [null],
        destination: [null],
        etatMiseEnValeur: [null]
      }),
    });

    this.autocompletionByIlotAndLibre=(search:string,params:Map<string,any>)=> {
      return this.parcelleService.autocompletionByIlot(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };

  }



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


  public attributaireChoisie: GeneralContribuable;

  receiveSubjectAttributaire(contri: GeneralContribuable) {
    this.attributaireChoisie = null;
    if (this.listeAttributairesParcelleOccupe) {
      const contribuableExistant = this.listeAttributairesParcelleOccupe.find((attributaire) => {
        return (attributaire as GeneralContribuable).guid === contri.guid;
      });
      if (contribuableExistant) {
        this._snackBar.open('Vous avez sélectionné le même contribuable sur la même parcelle.', 'Fermer', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        this.formulaire.controls["attributaire"].setValue(null);
      } else {
        this.attributaireChoisie = contri;
      }
    } else {
        this.attributaireChoisie = contri;
    }
  }

  public onSearchCessionSource(eventNgSelect) {
    this.cessionSourceRemoteAutocomplte.term.next(eventNgSelect.term);
  }
  public onSearchMotifRejet(eventNgSelect) {
    this.MotifRejetRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  /*************************** creation de documents**********************************/
  createDocument(document: Document = null) {
    if(document != null){
      return this.fb.group({
        id: [document.id],
        libelle:[document.libelle, [Validators.required]],
        numero:[document.numero, [Validators.required]],
        pieceJointe:[document.pieceJointe],
        documentType: [document.documentType.id, [Validators.required]],
        dateDoc: [document.dateDoc, [Validators.required]]
      });
    }else {
      return this.fb.group({
        id: [null],
        libelle: [null, [Validators.required]],
        numero: [null, [Validators.required]],
        pieceJointe: [null, [Validators.required]],
        documentType: [null, [Validators.required]],
        dateDoc: [null, [Validators.required]]
      });
    }
  }

  addDocument() {
    this.documents.insert(0, this.createDocument());
  }

  removeDocument(index) {
    this.documents.removeAt(index);
  }
  /***************** fin création document **********************/


  groupByFnArrondissement = (item) => item.commune.nom;
  groupValueFnArrondissement = (_: string, communes: any[]) => ({ name: communes[0].commune.nom, total: communes.length });

  receiveSubjectActeur(acteur: any) {
    // this.attribution.acteur= acteur;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }


    /*************************** creation de documents**********************************/
    createMandat(mandat: Mandat = null) {
      if(mandat != null){
        return this.fb.group({
          id: [mandat.id],
          actif: [mandat.actif],
          debut:[mandat.debut, [Validators.required]],
          fin:[mandat.fin, [Validators.required]],
          description:[mandat.description, [Validators.required]],
          objet:[mandat.objet, [Validators.required]],
          reference:[mandat.reference, [Validators.required]],
          pieceJointe:[mandat.pieceJointe],
          mandant: [mandat.mandant.guid, [Validators.required]],
          mandataire: [mandat.mandataire, [Validators.required]]
        });
      }else {
      return this.fb.group({
        id: [null],
        actif: [null],
        debut:[null, [Validators.required]],
        fin:[null, [Validators.required]],
        description:[null, [Validators.required]],
        objet:[null, [Validators.required]],
        reference:[null, [Validators.required]],
        pieceJointe:[null],
        mandant: [null, [Validators.required]],
        mandataire: [null, [Validators.required]]
      });
      }
    }

    addMandat() {
      this.mandats.insert(0, this.createMandat());

    }

    removeMandat(index) {

      this.mandats.removeAt(index);
      this.changeMandat(null);
    }
    /***************** fin création document **********************/

    public filteredListMandat: number[] = [];

    public changeMandat(mandat:Mandat){


    this.filteredListMandat = [];
    for (let i = 0; i < this.mandats.length; i++) {
      let man = this.mandats.at(i);
      if(man.value.id) {
        this.filteredListMandat.push(man.value.id);
      }
    }

    }
  initConfigAutocompleteActeur() {

    let callbackAutocomplete = (search:string,params:Map<string,any>)=> {
      return this.acteurService.autocompletion(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };
    this.acteurRemoteAutocomplete.customNgSelectConfig = {
      multiple: false,
      controlName: 'acteur',
      libelle: 'libelle',
      term: new Subject<string>(),
      callbackAutocomplete: callbackAutocomplete,
      formulaire: this.formulaire,
      placeholder: "L'acteur promoteur immobilier"
    };

    this.acteurRemoteAutocomplete.nativeNgSelectConfig.placeholder = "L'acteur promoteur immobilier";
    this.acteurRemoteAutocomplete.nativeNgSelectConfig.appendTo = 'body';
    this.acteurRemoteAutocomplete.nativeNgSelectConfig.bindValue = 'guid';
    this.acteurRemoteAutocomplete.listItemSelected = [];
    this.acteurRemoteAutocomplete.keyId = 'guid';
    this.acteurRemoteAutocomplete.callbackAutocomplete=callbackAutocomplete;

    this.acteurRemoteAutocomplete.mapFunction = (acteur: ActeurAutocomplete): ActeurAutocomplete => {
      acteur.libelle = acteur.denomination + " ( " + acteur.categorie + " )";
      acteur.libelleTelephone = acteur?.telephones?.map(value => value.value).join(', ');
      acteur.libelleEmail =  acteur?.emails?.map(value => value.value).join(', ');
      return acteur;
    };
    const colTabAttributaire = [
      { name: 'codeUnique', label: 'Code unique' },
      { name: 'statusJuridique', label: 'Status juridique' },
      { name: 'denomination', label: 'Dénomination' },
      { name: 'sigle', label: 'Sigle' },
      { name: 'categorie', label: 'Catégorie' },
      { name: 'pieceOfficielle.categorie.libelle', label: 'Type pièce' , type: TypeColonne.STRING },
      { name: 'pieceOfficielle.numero', label: 'Numéro pièce' , type: TypeColonne.STRING },
      { name: 'pieceOfficielle.nip', label: 'Nip pièce', type: TypeColonne.STRING  },
      { name: 'pieceOfficielle.dateObtention', label: 'date pièce' , type: TypeColonne.DATE },
      { name: 'profession', label: 'Profession' , type: TypeColonne.STRING },
      { name: 'libelleTelephone', label: 'Téléphone' , type: TypeColonne.STRING },
      { name: 'libelleEmail', label: 'Email' , type: TypeColonne.STRING },
    ];

    this.acteurRemoteAutocomplete.tableDescription = this.acteurRemoteAutocomplete.pushColumn(colTabAttributaire, 'Tableau des acteurs');

  }
  public dialogRefRapideContribuableForm: MatDialogRef<RapideContribuableFormComponent,any>;

  openFormAddModal(param?: any) {
    let { width,height,position}=this.getCorrectWidth();
    let guid = null;
    if(param){
      guid = param
    }

    this.dialogRefRapideContribuableForm = this.dialog.open(RapideContribuableFormComponent, {
      data: {
        guid
      },
      panelClass:"sycad-dialog-form",
      width: width,
      height: height,
      position: position,
      disableClose:true
    });
    this.dialogRefRapideContribuableForm.afterClosed().subscribe(data => {
     // this.openSnackBar("Element ajouté avec succès","OK");
     if(data){
      data.profession = data.profession?.nom;
      this.attributaireRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([data]);
      this.attributaireRemoteAutocomplete.initialList = [data];
      this.attributaireChoisie=data;
      this.attributaire.setValue(data.guid);
     }

    });
  }
  initConfigAutocompleteAttributaire() {

    let callbackAutocomplete = (search:string,params:Map<string,any>)=> {
      return this.contribuableService.autocompletion(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };
    this.attributaireRemoteAutocomplete.customNgSelectConfig = {
      multiple: false,
      controlName: 'attributaire',
      libelle: 'libelle',
      callbackAutocomplete: callbackAutocomplete,
      term: new Subject<string>(),
      formulaire: this.formulaire,
      placeholder: ""
    };

    this.attributaireRemoteAutocomplete.nativeNgSelectConfig.placeholder = "L'attributaire";
    this.attributaireRemoteAutocomplete.nativeNgSelectConfig.appendTo = 'body';
    this.attributaireRemoteAutocomplete.nativeNgSelectConfig.bindValue = 'guid';
    this.attributaireRemoteAutocomplete.listItemSelected = [];
    this.attributaireRemoteAutocomplete.keyId = 'guid';
    this.attributaireRemoteAutocomplete.callbackAutocomplete = callbackAutocomplete;
    const colTabAttributaire = [
      { name: 'codeUnique', label: 'Code unique', type: TypeColonne.STRING },
      { name: 'nom', label: 'Nom' , type: TypeColonne.STRING },
      { name: 'prenoms', label: 'Prénom' , type: TypeColonne.STRING },
      { name: 'genre', label: 'Genre' , type: TypeColonne.STRING },
      { name: 'statusJuridique', label: 'Status juridique', type: TypeColonne.STRING  },
      { name: 'denomination', label: 'Dénomination', type: TypeColonne.STRING  },
      { name: 'sigle', label: 'Sigle' , type: TypeColonne.STRING },
      { name: 'categorie', label: 'Catégorie' , type: TypeColonne.STRING },
      { name: 'pieceOfficielle.categorie.libelle', label: 'Type pièce' , type: TypeColonne.STRING },
      { name: 'pieceOfficielle.numero', label: 'Numéro pièce' , type: TypeColonne.STRING },
      { name: 'pieceOfficielle.nip', label: 'Nip pièce', type: TypeColonne.STRING  },
      { name: 'pieceOfficielle.dateObtention', label: 'date pièce' , type: TypeColonne.DATE },
      { name: 'profession', label: 'Profession' , type: TypeColonne.STRING },
      { name: 'libelleTelephone', label: 'Téléphone' , type: TypeColonne.STRING },
      { name: 'libelleEmail', label: 'Email' , type: TypeColonne.STRING },
    ];
    this.attributaireRemoteAutocomplete.mapFunction= (value : GeneralContribuable):GeneralContribuable=>{
      value.libelleTelephone = value.telephones.map(value => value.value).join(', ');
      value.libelleEmail =  value.emails.map(value => value.value).join(', ');
      return value;
    };
    this.attributaireRemoteAutocomplete.tableDescription = this.attributaireRemoteAutocomplete.pushColumn(colTabAttributaire, 'Liste des attributaires');

  }
  public onSearchDocumentType(eventNgSelect) {
    this.documentTypeRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  onChangeTypeDocuments(event: any) {
    // Vérifiez que l'événement contient les propriétés nécessaires
    if (event && event.id && event.libelle) {
      // Création d'une nouvelle instance de DocumentType
      const documentType = new DocumentType(); // Utilisez le constructeur de DocumentType

      documentType.id = event.id;
      documentType.libelle = event.libelle;
      documentType.estTitreFoncier = event.estTitreFoncier || false;
      documentType.estTitreParcelle = event.estTitreParcelle || false;
      documentType.actif = event.actif || false;


      this.selectedDocumentType = [];
      this.selectedDocumentType.push(documentType);

    }
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


  public getListeAttributairesParcelleOccupe(icad: string) {
    this.attributionService.getAttributionByIcad(icad).subscribe(data => {
      if(data){
        this.dossierRetour = data;
        this.isloading = false;
      }
    });
  }

  //lorsqu'on change de parcelle
  public icad: any;
  changeParcelle(parcelle: any) {
    this.listeAttributairesParcelleOccupe = null;

    const parcelleInexistanteGroup = this.formulaire.get('parcelleInexistante') as FormGroup;
    if (parcelleInexistanteGroup) {
      parcelleInexistanteGroup.reset();
    }

    this.isloading = true;
    this.getListeAttributairesParcelleOccupe(parcelle?.icad);
    if (parcelle?.icad) {
      this.icad = parcelle?.icad;
    } else {
      this.icad = null;
    }
  }

  //lorsquon clique le toggle parcelle inexistante
  toggleParcelle(value:any){
   // console.log(value)
    this.parcelleInexistantechoix = value.checked;
    setTimeout(()=>{
      this.initializeParcelleInexistante();
      this.manageParcelValidity();
    },0)

  }

  //lorsqqu'on selectionne parcelle inexistante rend le champ parcelle non obligatoire et si déselectionné le rend obligatoire
  manageParcelValidity() {
    const parcelleControl = this.formulaire.get('parcelle');
    if (this.parcelleInexistantechoix) {
      if (parcelleControl) {
        parcelleControl.clearValidators();
        parcelleControl.updateValueAndValidity();
      }
    }else{
      if (parcelleControl) {
        parcelleControl.setValidators(Validators.compose([Validators.required]));
        parcelleControl.updateValueAndValidity();
      }
    }
  }

  initializeParcelleInexistante() {
    if(this.attribution?.parcelleInexistante?.id){

      this.parcelleInexistanteElement = this.attribution?.parcelleInexistante;

      this.formulaire.get('parcelleInexistante').patchValue({
        id:this.attribution?.parcelleInexistante.id,
        section: this.attribution?.parcelleInexistante.section,
        ilot: this.attribution?.parcelleInexistante.ilot,
        numero:this.attribution?.parcelleInexistante.numero,
        etatMiseEnValeur:this.attribution?.parcelleInexistante['etatMiseEnValeur'],
        superficie:this.attribution?.parcelleInexistante.superficie,
      });

    }
  }
}
