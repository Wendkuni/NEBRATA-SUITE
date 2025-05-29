import {
  Component,
  forwardRef,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR, Validators
} from '@angular/forms';
import { of, Subject } from 'rxjs';
import {
  CategoriePieceProcessus,
  EtatProcess,
  Processus, Transition
} from '@sycadApp/models/workflow/common/general';

import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { RemoteAutocomplete
} from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { CategoriePiece } from '@sycadApp/models/data-references/contribuables/global.model';
import { DestinationParcelle } from '@sycadApp/models/bornage/destinationParcelle.model';
import { DocumentType } from '@sycadApp/models/data-references/system/document-type.model';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DestinationParcelleService } from '@sycadApp/services/bornage/destination-parcelle.service';
import { DocumentTypeService } from '@sycadApp/services/data-references/system/document-type.service';
import { CategoriePieceProcessusService } from '@sycadApp/services/workflow/categorie-piece-processus.service';


import { SycadUtils } from '@sycadShared/utils.functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigWorkflowSectionnementService } from '@sycadApp/services/workflow/config-workflow-sectionnement.service';
import {
  TransitionFonctionnelle
} from "@sycadApp/models/data-references/organigramme/transition-fonctionnelle.model";
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-config-form',
  templateUrl: './config-form.component.html',
  styleUrls: ['./config-form.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ConfigFormComponent), multi: true }],
  encapsulation: ViewEncapsulation.None,
})
export class ConfigFormComponent implements OnInit {

  public processus: Processus;

  public formulaire: FormGroup;

  @Input()
  public frontendUrl: String;

  private _onDestroy = new Subject<void>();
  public loading = false;
  public typePieceIdentiteRemoteAutocomplete = new RemoteAutocomplete<CategoriePiece>();
  public destinationsRemoteAutocomplete = new RemoteAutocomplete<DestinationParcelle>();
  public typeDocumentsRemoteAutocomplete = new RemoteAutocomplete<DocumentType>();

  public dataSourceDestinations = new MatTableDataSource();
  public displayedColumnsDestination: string[] = ['code', 'libelle', 'tutelle.nom'];
  public dataSourceTypeDocuments = new MatTableDataSource();
  public displayedColumnsTypeDocuements: string[] = ['code', 'libelle', 'estTitreFoncier', 'estTitreParcelle', 'actif'];
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "7rem",
    minHeight: "4rem",
    width: "auto",
    minWidth: "0",
    translate: "yes",
    enableToolbar: true,
    showToolbar: true,
    placeholder: "Saisir un texte...",
    defaultParagraphSeparator: "",
    defaultFontName: "",
    defaultFontSize: "",
    fonts: [
      { class: "arial", name: "Arial" },
      { class: "times-new-roman", name: "Times New Roman" },
      { class: "calibri", name: "Calibri" },
      { class: "comic-sans-ms", name: "Comic Sans MS" },
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: "redText",
        class: "redText",
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ],
    //uploadUrl: environment.APPLICATION.UPLOAD_FILE_API,
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: "top",
    toolbarHiddenButtons: [["bold", "italic"], ["fontSize"]],
  };


  get actif() { return this.formulaire.get('actif'); }
  get code() { return this.formulaire.get('code'); }
  get libelle() { return this.formulaire.get('libelle'); }
  get description() { return this.formulaire.get('description'); }
  get nbJours() { return this.formulaire.get('nbJours'); }
  get getCategoriePiece() { return this.formulaire.get('categoriePieces') as FormArray; }
  get nbExemplaire() { return this.formulaire.get('categoriePieces').get('nbExemplaire'); }
  get ordre() { return this.formulaire.get('categoriePieces').get('ordre'); }
  get obligatoire() { return this.formulaire.get('categoriePieces').get('obligatoire'); }
  get etats() { return this.formulaire.get('etats') as FormArray; }
  get transitions() { return this.formulaire.controls.transitions as FormArray; }
  get transitionPiece() { return this.formulaire.get('transitions').get('categoriePieces') as FormArray; }

  constructor(private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private mediaObserver: MediaObserver,
    private router: Router,
    private configWorflowService: ConfigWorkflowSectionnementService,
    public route: ActivatedRoute,
    public destinationService: DestinationParcelleService,
    public documentTypeService: DocumentTypeService,
    public typePieceIdentiteService: CategoriePieceProcessusService,
    public categoriePieceService: CategoriePieceService) {
    this.processus = this.route.snapshot.data['processus'];
    this.formulaire = this.fb.group({
      code: [null, Validators.compose([Validators.required])],
      nbJours: [null],
      libelle: [null],
      description: [null],
      actif: [ false],
      destinations: [null],
      typeDocuments: [null],
      categoriePieces: new FormArray([]),
      etats: new FormArray([]),
      transitions: new FormArray([])
    });
  }


  public isNotFixedValue: boolean = true;
  onTouch: any = () => { };
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';

    });
  }

  onChangeCategoriePiece(categorie, index){
    const formGroup = this.formulaire.controls.categoriePieces['controls'][index];
    formGroup.get('libelle').patchValue(categorie.libelle);
  }

  ngOnInit(): void {
    this.typePieceIdentiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.categoriePieceService);
    this.destinationsRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.destinationService);
    this.typeDocumentsRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.documentTypeService);

    if (this.processus.typeDocuments) {
      this.typeDocumentsRemoteAutocomplete.listRessource$ = of(this.processus.typeDocuments);
      this.typeDocumentsRemoteAutocomplete.initialList = this.processus.typeDocuments;

    }


    let catPieceProcessus=[]
    if (this.processus.categoriePieces) {
    this.processus.categoriePieces.forEach(catePiece=>{
      catPieceProcessus.push(catePiece.categoriePiece);
    });
    this.typePieceIdentiteRemoteAutocomplete.listRessource$ = of(catPieceProcessus);
    this.typePieceIdentiteRemoteAutocomplete.initialList = catPieceProcessus;
    }



    this.dataSourceTypeDocuments.data = this.processus.typeDocuments;
    this.dataSourceDestinations.data = this.processus.destinations;
    this.categoriePieceProcessus$ = this.processus.categoriePieces;

    if (this.processus) {

      if (this.processus.categoriePieces) {
        this.isNotFixedValue = true;
        this.processus.categoriePieces.map(categoriePiece => {
          this.getCategoriePiece.insert(0, this.createCategoriePieces(categoriePiece));
        });
      }

      if (this.processus.etats) {
        this.processus.etats.map(etat => {
          this.etats.insert(0, this.createEtats(etat));
        });
      }

      if (this.processus.transitions) {
        this.processus.transitions.map(transition => {
          this.transitions.insert(0, this.createTransition(transition));
        });
      }

      this.formulaire.patchValue({
        actif: this.processus.actif,
        libelle: this.processus.libelle,
        nbJours: this.processus.nbJours,
        description: this.processus.description,
        code: this.processus.code,
        destinations: this.processus.destinations.map(destination => destination.id),
        typeDocuments: this.processus.typeDocuments.map(typeDocument => typeDocument.id),
        etats: [],
        transitions: []
      });

    }
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  onSearchCategoriePiece(eventNgSelect) {
    this.typePieceIdentiteRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  onSearchDestination(eventNgSelect) {
    this.destinationsRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onChangeDestination(destinations) {
    this.dataSourceDestinations = destinations;
  }

  onSearchTypeDocuments(eventNgSelect) {
    this.typeDocumentsRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onChangeTypeDocuments(typeDocuments) {
    this.dataSourceTypeDocuments = typeDocuments;
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: 'top'

    });
  }

  public categoriePieceProcessus$: CategoriePieceProcessus[] = [];
  public idCategoriePieceListChosen$: number[] = [];


  public changeCategoriePiece(data: CategoriePieceProcessus) {
    this.idCategoriePieceListChosen$ = [];
    for (let i = 0; i < this.getCategoriePiece.length; i++) {
      let categoriePiece = this.getCategoriePiece.at(i);
      this.idCategoriePieceListChosen$.push(categoriePiece.value.categoriePiece.id);
    }
    let that = this;
    this.categoriePieceProcessus$ = this.processus.categoriePieces.filter((categoriePiece) => {
      return (that.idCategoriePieceListChosen$.indexOf(categoriePiece.id) < 0);
    });

  }
  /*********************************** création des catégories de pièces ***************************************************/
  createCategoriePieces(categoriePieces: CategoriePieceProcessus) {
    if (categoriePieces) {
      return this.fb.group({
        id: [categoriePieces.id],
        nbExemplaire: [categoriePieces.nbExemplaire, Validators.compose([Validators.required])],
        ordre: [categoriePieces.ordre, Validators.compose([Validators.required])],
        obligatoire: [categoriePieces.obligatoire, Validators.compose([Validators.required])],
        categoriePiece: [categoriePieces.categoriePiece?.id, Validators.compose([Validators.required])],
        libelle: [categoriePieces.libelle, Validators.compose([Validators.required])],
        estAffiche: [categoriePieces.estAffiche],
      });
    } else {
      return this.fb.group({
        id: [null],
        nbExemplaire: [null, Validators.compose([Validators.required])],
        ordre: [0, Validators.compose([Validators.required])],
        obligatoire: [false, Validators.compose([Validators.required])],
        categoriePiece: [null, Validators.compose([Validators.required])],
        libelle: [null, Validators.compose([Validators.required])],
        estAffiche: [true]
      });
    }
  }
  addCategoriePiecesProcessus() {
    this.getCategoriePiece.insert(0, this.createCategoriePieces(null));
  }
  removeCategoriePieceProcessus(index) {
    this.getCategoriePiece.removeAt(index);
  }

  getCategoriePieceTransition(transition: AbstractControl) {

    let categoriePieces: FormArray = transition.get("categoriePieces") as FormArray;

    return categoriePieces;
  }
  addCategoriePiecesTransition(indexTransition) {

    let transition = this.transitions.at(indexTransition);
    let categoriePieces: FormArray = this.getCategoriePieceTransition(transition);
    categoriePieces.insert(0, this.createCategoriePieces(null));
  }
  removeCategoriePieceTransition(indexTransition, indexPieceTransition) {
    let transition = this.transitions.at(indexTransition);
    let categoriePieces: FormArray = this.getCategoriePieceTransition(transition);
    categoriePieces.removeAt(indexPieceTransition);
  }
  /************************************ fin *************************************************************/

  /*********************************** création des états *******************************************************************/

  createEtats(etat: EtatProcess) {
    if (etat) {
      return this.fb.group({
        id: [etat.id],
        code: [etat.code],
        libelle: [etat.libelle],
        description: [etat.description]
      });
    } else {
      return this.fb.group({
        id: [null],
        code: [null],
        libelle: [null],
        description: [null]
      });
    }
  }
  addEtats() {
    this.etats.insert(0, this.createEtats(null));
  }
  removeEtat(index) {
    this.etats.removeAt(index);
  }
  /******************************* fin création états ***************************************************/


  /*********************************** création des transitions *******************************************************************/

  createTransition(transition: Transition) {
    if (transition) {

      let transitionForm = this.fb.group({
        id: [transition.id],
        code: [transition.code],
        libelle: [transition.libelle],
        description: [transition.description],
        nbJours: [transition.nbJours],
        categoriePieces: new FormArray([]),
        transitionFonctionnelle: this.createTransitionFonctionnelle(transition.transitionFonctionnelle),
      });


      transition.categoriePieces.map(piece => {
        (transitionForm.get("categoriePieces") as FormArray).insert(0, this.createCategoriePieces(piece));
      });


      return transitionForm;
    } else {
      return this.fb.group({
        id: [null],
        code: [null],
        libelle: [null],
        description: [null],
        nbJours: [null],
        categoriePieces: new FormArray([]),
        transitionFonctionnelle: this.createTransitionFonctionnelle(null),
      });
    }
  }

  createTransitionFonctionnelle(transitionFonctionnelle:TransitionFonctionnelle) {
    if(transitionFonctionnelle) {

      const typeTransition = transitionFonctionnelle?.typeTransition ?? null;
      const domaineFonctionnels = transitionFonctionnelle?.domaineFonctionnels ?? [];

      const fb = this.fb.group({
        id: [transitionFonctionnelle.id],
        typeTransition: [typeTransition],
        domaineFonctionnels: [domaineFonctionnels.map(domaineFonctionnel => domaineFonctionnel)]
      });

      return fb;
    }else {
      return this.fb.group({
        id: [null],
        typeTransition: [null],
        domaineFonctionnels: [null],
      });
    }
  }

  /******************************* fin création transition ***************************************************/


  update() {
    if (this.formulaire.valid) {
      this.loading = true;
      this.configWorflowService.update(this.formulaire.value).subscribe(data => {
        this.loading = false;
        this.openSnackBar('Configuration workflow modifié avec succès', 'OK');
        this.router.navigate([this.frontendUrl]);
      },
        errorResponse => {
          this.loading = false;
          SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
        });
    }
  }
  annuler() {
    this.router.navigate([this.frontendUrl]);
  }

}
