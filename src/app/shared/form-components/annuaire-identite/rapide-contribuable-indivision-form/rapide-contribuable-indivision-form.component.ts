import { Component, Inject, Input, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IndivisionsService } from '@sycadApp/services/data-references/contribuables/indivisions.service';
import { ContactContribuableService } from '@sycadApp/services/data-references/system/contact.service';
import { StatusJuridiqueService } from '@sycadApp/services/data-references/system/status-juridique.service';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { GeneralContribuable, Nationalite, PieceOfficielle } from '@sycadApp/models/data-references/contribuables/global.model';
import { EventEmitter } from '@angular/core';
import { StatusJuridiqueAutocomplete } from '@sycadApp/models/data-references/system/model';
import { RemoteAutocomplete } from '../../model/remote-autocomplete';
import { AttributsExist } from '@sycadApp/shared/validators/remote/attributs-exist';
import { AppSettingsService } from '@sycadApp/config/app.settings.service';
import { Settings } from '@sycadApp/config/app.settings.model';
import { IndivisionElement, IndivisionMembreElement } from '@sycadApp/models/data-references/contribuables/indivisions.model';
import { IndivisionRelationAutocomplete, IndivisionRelationElement, QualiteRelation } from '@sycadApp/models/data-references/system/indivision-relation.model';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { RemoteAutocompleteIndivisionMemebrable } from '../../model/remote-autocomplete-guid';
import { Subject, of, takeUntil} from "rxjs";
import { IndivisionrelationService } from '@sycadApp/services/data-references/contribuables/indivisionRelation.service';
import { NationaliteService } from '@sycadApp/services/data-references/system/nationalite.service';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { getErrors } from '@sycadApp/shared/validators/global-pattern';
import { DateAdapter } from '@angular/material/core';
import { RechercheContribuableIFU } from '../../data-references-domaine/recherche-ifu/recherche-ifu.component';

@Component({
  selector: 'app-rapide-contribuable-indivision-form',
  templateUrl: './rapide-contribuable-indivision-form.component.html',
  styleUrls: ['./rapide-contribuable-indivision-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RapideContribuableIndivisionFormComponent implements OnInit {
  public formulaire: FormGroup;
  public settings: Settings;
  public  indivision: IndivisionElement;
  public isLoadingResults = false;
  private _onDestroy = new Subject<void>();

  // Les autocomplete servent à récupérer et gérer des listes d'éléments dans le formulaire, comme les options des select.
  // Il y'a 3 étapes : L'initialisation de la liste ( dans ngOnInit ), l'affichage des valeurs ( toujours dans ngOnInit ),
  // Et parfois un filtrage ( dans onSearch<L'élément> )
  public relationRemoteAutocomplete = new RemoteAutocomplete<IndivisionRelationAutocomplete>();
  public statusJuridiqueRemoteAutocomplete = new RemoteAutocomplete<StatusJuridiqueAutocomplete>();
  public nationaliteRemoteAutocomplete = new RemoteAutocomplete<Nationalite>();
  public contribuableRemoteAutocomplete = new RemoteAutocompleteIndivisionMemebrable();

  public formErrors: Array<string>;
  public qualiteList$ : QualiteRelation[]= [];
  public qualiteListSave$ :number[]= [];
  public currentRelation:IndivisionRelationElement;

  public activeMediaQuery = '';

  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  @Output("ajouterContribuable")
  public ajouterContribuable: EventEmitter<GeneralContribuable> = new EventEmitter<GeneralContribuable>();

  @Input("updateContribuable")
  public updateContribuable: string = null;

  public contribuableUpdate: IndivisionElement = null;

  // Variables collectant les informations saisies sur le formulaire
  get pieceOfficielle() { return this.formulaire.get('pieceOfficielle'); }
  get denomination() { return this.formulaire.get('denomination'); }
  get csrf() { return this.formulaire.get("csrf");}
  get active() { return this.formulaire.get('active'); }
  get guid() {return this.formulaire.get('guid');}
  get profiles() {return this.formulaire.get("utilisateur").get('profiles');}
  get membres(): FormArray { return this.formulaire.get("membres") as FormArray; }
  get relation() { return this.formulaire.get("relation");}
  get dateDeCreation() { return this.formulaire.get("dateDeCreation"); }
  get nationalite() { return this.formulaire.get("nationalite") ;}
  get statusJuridique(){return this.formulaire.get("statusJuridique");}
  get getFormPieceComplementaire() { return this.formulaire.controls.pieceComplementaires as FormArray; }

  // L'importation de certains services causera problème si ils ne sont pas déclarés dans la liste provider du fichier
  // src/app/features/cession-parcelle-domaine/saisie-differee-attribution/sd-attribution.module.ts
  // Prennez le soin de les ajouter là bas avant de revenir les ajouter au constructeur. (voir SYCAD 858)
  constructor( public dialogRef: MatDialogRef<RapideContribuableIndivisionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar,
    public fb: FormBuilder,
    public appSettings: AppSettingsService,
    public statutJuridiqueService: StatusJuridiqueService,
    public confirmService:AppConfirmService,
    private _adapter: DateAdapter<any>,
    public nationaliteService: NationaliteService,
    public relationService: IndivisionrelationService,
    public contribuableIndivisionService: IndivisionsService,
    private mediaObserver: MediaObserver,
    public contactContribuableService: ContactContribuableService
    ) {
      this.settings = this.appSettings.settings;
      // Vous ne pourrez pas récupérer les champs avec get (plus haut) si ils ne sont pas déclarés ici.
      this.formulaire = this.fb.group({
        guid: null,
        denomination: [null, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
        statusJuridique: [null],
        membres: this.fb.array([]),
        relation: [null, Validators.compose([Validators.required])],
        dateDeCreation: [null, Validators.compose([Validators.required])],
        nationalite:[null],

        pieceOfficielle:this.fb.group({
          categorie: [null, [Validators.required,Validators.maxLength(150),Validators.minLength(2)]],
          dateExpiration: [null],
          dateObtention: [null, Validators.compose([Validators.required])],
          numero: [null,
            Validators.compose([Validators.required,Validators.maxLength(150),Validators.minLength(2)]),
            [AttributsExist.validateNumeroPieceExistFn(this.contactContribuableService,true)]],
          nip: [null],
          autoriteDeDelivrance: [null],
          lieuDeDelivrance: [null],
          codeDownload: null,
        }),
      });

    }

  ngOnInit(): void {

    this.formulaire.valueChanges.pipe(
      takeUntil(this._onDestroy)
    ).subscribe(() => {
      this.formErrors = getErrors(this.formulaire);
    });

    this._adapter.setLocale("fr");

    // Initialisation des autocompletes
    this.statusJuridiqueRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.statutJuridiqueService);
    this.nationaliteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.nationaliteService);
    this.relationRemoteAutocomplete.initializeRemoteAutocompletion(
      this._onDestroy,
      this.relationService
    );
    this.contribuableRemoteAutocomplete.initializeRemoteAutocompletion(
      this._onDestroy,
      this.contribuableIndivisionService
    );

    if (this.indivision) {

       // Chargement de la liste des relations
       if(this.indivision?.relation) {
         this.relationRemoteAutocomplete.listRessource$=of([this.indivision.relation]);
         this.relationRemoteAutocomplete.initialList=[this.indivision.relation];
         this.currentRelation=this.indivision.relation;
       }

       // Chargement de la liste des nationalités
       if(this.indivision?.nationalite) {
         this.nationaliteRemoteAutocomplete.listRessource$=of([this.indivision.nationalite]);
         this.nationaliteRemoteAutocomplete.initialList=[this.indivision.nationalite];
       }

       // Chargement de la liste des statuts juridiques
       if(this.indivision?.statusJuridique) {
         this.statusJuridiqueRemoteAutocomplete.listRessource$=of([this.indivision.statusJuridique]);
         this.statusJuridiqueRemoteAutocomplete.initialList=[this.indivision.statusJuridique];
       }

       // Charger la liste des membres d'indivisions
       if (this.indivision.membres) {
           this.indivision.membres.map((mem) => {
             this.membres.insert(0, this.createMembreForm(mem));
         });
         this.qualiteList$=this.currentRelation?.qualites;
         setTimeout(() => {
           this.onChangeQualite();
         } );
       }

       // Si il y'a des pièces complémentaires
       if (this.indivision.pieceComplementaires) {
         this.indivision.pieceComplementaires.map((piece) => {
           this.getFormPieceComplementaire.insert(0, this.createPieceOfficielle(piece));
       });
       }

       // Charger la pièce officielle
       this.formulaire.patchValue({
         pieceOfficielle: {
           codeDownload: this.indivision.pieceOfficielle.documentPiece,
         }
        });

       this.formulaire.patchValue({
         guid: this.indivision.guid,
         active: this.indivision.active,
         dateDeCreation: this.indivision.dateDeCreation,
         relation: this.indivision.relation ? this.indivision.relation.id : null,
         denomination: this.indivision.denomination,
         pieceOfficielle: this.indivision.pieceOfficielle,
         nationalite:  this.indivision.nationalite ? this.indivision.nationalite.id : null,
         statusJuridique:  this.indivision.statusJuridique ? this.indivision.statusJuridique.id : null
     });

     } else {
       // Sinon, se contenter de créer.
       this.indivision = new IndivisionElement();
     }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.updateContribuable) {

      this.contribuableIndivisionService.get(this.updateContribuable).subscribe(data =>{
        this.contribuableUpdate = data;
        this.formulaire.patchValue({
          relation: this.contribuableUpdate?.relation?.id,
          dateDeCreation: this.contribuableUpdate?.dateDeCreation,
          denomination: this.contribuableUpdate?.denomination,
          pieceOfficielle: this.contribuableUpdate?.pieceOfficielle,
        });

        this.formulaire.controls.pieceOfficielle.patchValue({
          categorie: this.contribuableUpdate?.pieceOfficielle?.categorie?.id
        });
        
        if (this.contribuableUpdate?.membres) {
          this.contribuableUpdate?.membres.map((membre) => {
            this.membres.insert(0, this.createMembreForm(membre));
          });
        }
      }, errorResponse => {
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      });
    }
  }

  importContribuable(contribuable: GeneralContribuable) {
    if(contribuable){
      this.ajouterContribuable.emit(contribuable);
    }
  }

  trouveContribuable(rechercheContribuableIFU: RechercheContribuableIFU){
    if(!rechercheContribuableIFU.success){
      SycadUtils.notifyRemoteError( {message: rechercheContribuableIFU.message}, this._snackBar);
    }else {
      this.openSnackBar("Un résultat a été trouvé","OK");
    }

  }

  createPieceOfficielle(piece:PieceOfficielle) {
    if(piece) {
      return this.fb.group({
        id: [piece.id],
        categorie: [piece.categorie, Validators.compose([Validators.required])],
        dateExpiration: [piece.dateExpiration, Validators.compose([Validators.required])],
        dateObtention: [piece.dateObtention, Validators.compose([Validators.required])],
        numero: [piece.numero,
          Validators.compose([Validators.required, Validators.maxLength(150), Validators.minLength(2)]),
        [AttributsExist.validateNumeroPieceExistFn(this.contactContribuableService)]],
        nip: [piece.nip],
        autoriteDeDelivrance: [piece.autoriteDeDelivrance, Validators.compose([Validators.required])],
        lieuDeDelivrance: [piece.lieuDeDelivrance, Validators.compose([Validators.required])],
        codeDownload: [piece.documentPiece],
      });
    }else {
      return this.fb.group({
        id: [null],
        categorie: [null, Validators.compose([Validators.required])],
        dateExpiration: [null, Validators.compose([Validators.required])],
        dateObtention: [null, Validators.compose([Validators.required])],
        numero: [null,
          Validators.compose([Validators.required, Validators.maxLength(150), Validators.minLength(2)]),
        [AttributsExist.validateNumeroPieceExistFn(this.contactContribuableService)]],
        nip: [null],
        autoriteDeDelivrance: [null, Validators.compose([Validators.required])],
        lieuDeDelivrance: [null, Validators.compose([Validators.required])],
        codeDownload: null,
      });
    }
  }

  public onSearchRelation(eventNgSelect) {
    this.relationRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  addNewMembre() {
    this.membres.insert(0, this.createMembreForm(null));
    this.onChangeQualite();
  }

  public onSearchContribuable(eventNgSelect) {
    this.contribuableRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  onChangeQualite() {
    this.qualiteListSave$=[];
    for (let i = 0; i < this.membres.length; i++) {
      let membre = this.membres.at(i);
      this.qualiteListSave$.push( membre.value.qualite);
      }
      if(this.currentRelation) {
        let that=this;
        this.qualiteList$ = this.currentRelation.qualites.filter((qualite) => {
          if(qualite.multiple===true) return true;
            return  ( that.qualiteListSave$.indexOf(qualite.id) <0 ) ;
        });
    }
}

removeMembre(index) {

  let membre = this.membres.at(index);

  if (membre.value.id) {
    this.confirmService.confirm({
      title:"Confirmation",
      message:`Voulez-vous supprimer ce membre ?`
    }).subscribe(($choix)=> {
      if($choix) {
        this.isLoadingResults=true;
        this.contribuableIndivisionService.deleteMembresIndivision(this.indivision.guid,membre.value.id).subscribe(
          (result) => {
            this.isLoadingResults=false;
            this.openSnackBar("Element supprimé avec succès", "OK");
            this.membres.removeAt(index);
            this.onChangeQualite();
          },
          (errorResponseMembre) => {
            this.isLoadingResults=false;
            SycadUtils.notifyRemoteError(errorResponseMembre.error, this._snackBar);
          }
        );
      }

    });
  } else {
    this.membres.removeAt(index);
    this.onChangeQualite();
  }

}

  private createMembreForm(membre:IndivisionMembreElement): FormGroup {
    if(membre) {

      this.qualiteList$.push(membre.qualite);
      return this.fb.group({
        id: [membre.id],
        membre: [membre.membre.guid, Validators.compose([Validators.required])],
        qualite: [membre.qualite.id, Validators.compose([Validators.required])],
      });
    }else {
      return this.fb.group({
        id: null,
        membre: [null, Validators.compose([Validators.required])],
        qualite: [null, Validators.compose([Validators.required])],
      });
    }

  }


  public onChangeRelation(event:IndivisionRelationElement) {
    this.membres.clear();
    this.qualiteList$=[];
    this.qualiteListSave$=[];
    if(event) {
      this.currentRelation=event;
    }else {
      this.currentRelation=null;
    }
  }

  // Quand on clique sur Enregistrer
  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }
    else {

     // Ces valeurs sont fixes. Ce serait préférable de rechercher les éléments, puis de récupérer leurs id plutôt que
     // de les mettre en dur, comme cela. Si vous contez en ajouter, notifiez que vous devez supprimer le validator correspondant
     // dans le constructor ( voir nationalite )
     this.formulaire.controls['nationalite'].setValue(176);
     this.formulaire.controls['statusJuridique'].setValue(20);

     if(this.updateContribuable != null){
        // Utiliser le service pour ajouter une indivision à partir des informations de ce formulaire.
     if (this.formulaire.value) {

      this.formulaire.value.guid = this.updateContribuable;
      this.contribuableIndivisionService.update(this.formulaire.value).subscribe(
          data => {
            this.dialogRef.close(data);
          },
          // Ou afficher une erreur si échec
          errorResponse => {
            SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
          }
        );
        }
     } else {

     // Utiliser le service pour ajouter une indivision à partir des informations de ce formulaire.
     if (this.formulaire.value) {
      this.contribuableIndivisionService.add(this.formulaire.value).subscribe(
        data => {
          this.dialogRef.close(data);
        },
        // Ou afficher une erreur si échec
        errorResponse => {
          SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
        }
      );
      }
     }
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }

  closeFormModal(): void {
    this.dialogRef.close();
  }

}
