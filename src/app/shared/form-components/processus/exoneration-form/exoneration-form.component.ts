import {
  Component, Input,
  OnInit, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {FormBuilder, FormControl, FormControlName, FormGroup} from '@angular/forms';
import {
  DropzoneComponent,
  DropzoneConfigInterface
} from 'ngx-dropzone-wrapper';
import {RemoteAutocomplete} from '@sycadShared/form-components/model/remote-autocomplete';
import {ParcelleElement} from '@sycadApp/models/data-references/territoire/localite.model';
import {AdvancedRemoteAutocomplete} from '@sycadShared/form-components/data-references-domaine/field-remote-autocomplete/advanced-remote-autocomplete';
import {GeneralContribuable} from '@sycadApp/models/data-references/contribuables/global.model';
import {NatureImpot} from '@sycadApp/models/impot/nature-impot.model';
import {ExonerationCategorie} from '@sycadApp/models/evaluation/exoneration-categorie.model';
import {
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import {DateAdapter} from '@angular/material/core';
import {ContribuableService} from '@sycadApp/services/data-references/system/contribuable.service';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {NatureImpotService} from '@sycadApp/services/impot/nature-impot.service';
import {ExonerationCategorieService} from '@sycadApp/services/evaluation/exoneration-categorie.service';
import {RapideContribuableFormComponent} from '@sycadShared/form-components/annuaire-identite/rapide-contribuable-form/rapide-contribuable-form.component';
import {catchError, map, takeUntil} from 'rxjs/operators';
import { ExonerationService } from '@sycadApp/services/impot/exoneration.service';
import { getErrors } from '@sycadApp/shared/validators/global-pattern';
import { TypeColonne } from '@sycadApp/libs/model-table';

@Component({
  selector: 'app-exoneration-form',
  templateUrl: './exoneration-form.component.html',
  styleUrls: ['./exoneration-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExonerationFormComponent implements OnInit {
  private _onDestroy = new Subject<void>();
  @Input("formGroup") exonerationForm: FormGroup;
  @Input("contribuable") contribuableChoisie: GeneralContribuable;
  @Input() parcelleChoisie: ParcelleElement;
  @Input()
  touched: boolean;
  @Input('formControlName') formControlName: FormControl;


  public parcelleRemoteAutocomplete = new RemoteAutocomplete<ParcelleElement>();
  public contribuableRemoteAutocomplete = new AdvancedRemoteAutocomplete<GeneralContribuable>();
  public natureImpotRemoteAutocomplete = new RemoteAutocomplete<NatureImpot>();
  public categorieRemoteAutocomplete = new RemoteAutocomplete<ExonerationCategorie>();


  public autocompletionByIlotAndOccupee:(search:string,params:Map<string,any>)=>Observable<any[]>;

  get motif() { return this.exonerationForm.get('motif');}
  get refExterne() {return this.exonerationForm.get('refExterne');}
  get categorie() {return this.exonerationForm.get('categorie');}
  get dateDebut() {return this.exonerationForm.get('dateDebut');}
  get modifDoc() {return this.exonerationForm.get('modifDoc');}
  get dateFin() {return this.exonerationForm.get('dateFin');}
  get natureImpot() {return this.exonerationForm.get('natureImpot');}
  get contribuable(){return this.exonerationForm.get('contribuable');}
  get parcelle(){return this.exonerationForm.get('parcelle');}
  get taux(){return this.exonerationForm.get('taux');}
  get montant(){return this.exonerationForm.get('montant');}
  public formErrors: Array<string>;
  @ViewChild(DropzoneComponent, { static: false })
  dropzoneComponentRef?: DropzoneComponent;
  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    autoReset: null,
    resizeWidth :300,
    resizeHeight :300,
    thumbnailHeight: 300,
    thumbnailWidth: 300,
    acceptedFiles: 'image/*,application/pdf',
    errorReset: null,
    cancelReset: null
  };
  public documentPiece = '';
  constructor(    public dialog: MatDialog,
                  private fb: FormBuilder,
                  private mediaObserver: MediaObserver,
                  private _adapter: DateAdapter<any>,
                  public contribuableService: ContribuableService,
                  public parcelleService: ParcelleService,
                  public exonerationService: ExonerationService,
                  public natureImpotService: NatureImpotService,
                  public categorieService: ExonerationCategorieService) { }


  public activeMediaQuery = '';

  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });

  }
  ngOnInit(): void {
    this._adapter.setLocale("fr");

     this.exonerationForm.valueChanges.pipe(
      takeUntil(this._onDestroy)
    ).subscribe(() => {
      this.formErrors = getErrors(this.exonerationForm);
    });
    this.natureImpotRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.natureImpotService);
    this.categorieRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.categorieService);
    this.parcelleRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.parcelleService);
    this.initConfigAutocompleteContribuable();

    if(this.exonerationForm.value.natureImpot){
      this.natureImpotRemoteAutocomplete.listRessource$= of([this.exonerationForm.value.natureImpot]);
      this.natureImpotRemoteAutocomplete.initialList = [this.exonerationForm.value.natureImpot];
      this.exonerationForm.patchValue({
        natureImpot: this.exonerationForm.value.natureImpot.id
      });
    }
    if(this.exonerationForm.value.categorie){
      this.categorieRemoteAutocomplete.listRessource$=of([this.exonerationForm.value.categorie]);
      this.categorieRemoteAutocomplete.initialList=[this.exonerationForm.value.categorie];
      this.exonerationForm.patchValue({
        categorie: this.exonerationForm.value.categorie.id
      });
    }
    if(this.exonerationForm.value.contribuable){
      this.contribuableRemoteAutocomplete.customNgSelectConfig.listRessource$=of([this.exonerationForm.value.contribuable]);
      this.contribuableRemoteAutocomplete.initialList= [this.exonerationForm.value.contribuable];
      this.exonerationForm.patchValue({
        contribuable: this.exonerationForm.value.contribuable.guid
      });
    }
    if(this.exonerationForm.value.modifDoc){
      this.documentPiece = this.exonerationForm.value.modifDoc,
        this.exonerationForm.patchValue({
          modifDoc: null
        });
    }
    if(this.exonerationForm.value.parcelle){
      this.exonerationForm.value.parcelle.arrondissement.commune = this.exonerationForm.value.parcelle.ilot.section.commune
      this.exonerationForm.patchValue({
        parcelle: this.exonerationForm.value.parcelle.id
      });
    }
    this.autocompletionByIlotAndOccupee=(search:string,params:Map<string,any>)=> {
      return this.parcelleService.autocompletionByIlotAndOccupee(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
          return of([]);
        })
      );
    };
  }


  public dialogRefRapideContribuableForm: MatDialogRef<RapideContribuableFormComponent,any>;

  openFormAddModal($event) {
    let { width,height,position}=this.getCorrectWidth();
    this.dialogRefRapideContribuableForm = this.dialog.open(RapideContribuableFormComponent, {
      data: {},
      panelClass:"sycad-dialog-form",
      width: width,
      height: height,
      position: position,
      disableClose:true
    });
    this.dialogRefRapideContribuableForm.afterClosed().subscribe(data => {
      // this.openSnackBar("Element ajouté avec succès","OK");
      if(data){
        this.contribuableRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([data]);
        this.contribuableRemoteAutocomplete.initialList = [data];
        this.contribuableChoisie=data;
        this.contribuable.setValue(data.guid);
       }
    });
  }


  receiveSubjectContribuable(contri: GeneralContribuable) {
    this.contribuableChoisie = contri;
  }


  initConfigAutocompleteContribuable() {

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
    this.contribuableRemoteAutocomplete.customNgSelectConfig = {
      multiple: false,
      controlName: 'contribuable',
      libelle: 'libelle',
      callbackAutocomplete: callbackAutocomplete,
      term: new Subject<string>(),
      formulaire: this.exonerationForm,
      placeholder: ""
    };

    this.contribuableRemoteAutocomplete.nativeNgSelectConfig.placeholder = "Le contribuable";
    this.contribuableRemoteAutocomplete.nativeNgSelectConfig.appendTo = 'body';
    this.contribuableRemoteAutocomplete.nativeNgSelectConfig.bindValue = 'guid';
    this.contribuableRemoteAutocomplete.listItemSelected = [];
    this.contribuableRemoteAutocomplete.keyId = 'guid';
    this.contribuableRemoteAutocomplete.callbackAutocomplete = callbackAutocomplete;
    const colTabContribuable = [
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
    this.contribuableRemoteAutocomplete.mapFunction= (value : GeneralContribuable):GeneralContribuable=>{
      value.libelleTelephone = value.telephones.map(value => value.value).join(', ');
      value.libelleEmail =  value.emails.map(value => value.value).join(', ');
      return value;
    };
    this.contribuableRemoteAutocomplete.tableDescription = this.contribuableRemoteAutocomplete.pushColumn(colTabContribuable, 'Liste des contribuables');

  }
  public onSearchCategorie(evetNgSelect){
    this.categorieRemoteAutocomplete.term.next(evetNgSelect.term);
  }
  public onSearchNatureImpot(eventNgSelect){
    this.natureImpotRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  groupByFnArrondissement = (item) => item.commune.nom;
  groupValueFnArrondissement = (_: string, communes: any[]) => ({ name: communes[0].commune.nom, total: communes.length });
  public onUploadError(args: any): void {
    this.dropzoneComponentRef.directiveRef.reset();
  }
  public resetDropZone(): void {
    this.dropzoneComponentRef.directiveRef.reset();
    this.modifDoc.setValue(null);
  }
  public onUploadSuccess(remoteResponse): void {
    this.modifDoc.setValue(remoteResponse[1].name);
  }
  public onUploadInit(args: any): void {

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
        width: '80vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("md")) {
      return {
        width: '60vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("lg")) {
      return {
        width: '55vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }
    if(this.mediaObserver.isActive("xl")) {
      return {
        width: '50vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }
  }
}
