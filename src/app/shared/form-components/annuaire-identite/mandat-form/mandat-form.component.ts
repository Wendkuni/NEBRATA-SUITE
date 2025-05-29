import { Component, EventEmitter, Input, IterableDiffers, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GeneralContribuable } from '@sycadApp/models/data-references/contribuables/global.model';
import { Mandat } from '@sycadApp/models/workflow/common/general';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';
import { MandatService } from '@sycadApp/services/workflow/mandat.service';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { DropzoneComponent, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { of, Subject } from 'rxjs';
import { RapideContribuableFormComponent } from '../rapide-contribuable-form/rapide-contribuable-form.component';
import {DateAdapter} from '@angular/material/core';
import { AdvancedRemoteAutocomplete } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/advanced-remote-autocomplete';
import { catchError, map } from 'rxjs/operators';
import { TypeColonne } from '@sycadApp/libs/model-table';


@Component({
  selector: 'app-mandat-form',
  templateUrl: './mandat-form.component.html',
  styleUrls: ['./mandat-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MandatFormComponent implements  OnInit {


  private _onDestroy = new Subject<void>();
  @Input("formGroup") mandatForm: FormGroup;

  @Input("withMandataire")
   withMandataire: Boolean;
  @Input("withMandant") withMandant: Boolean;
  @Input("withMandat") withMandat: Boolean;
  @Input("choixMandant") choixMandant: GeneralContribuable;
  @Input("choixMandataire") choixMandataire: GeneralContribuable;

  @Input("filteredListMandat")  public filteredListMandat: number[]

  public mandatId:number;

  get id() { return this.mandatForm.get('id'); }
  get objet() { return this.mandatForm.get('objet'); }
  get debut() { return this.mandatForm.get('debut'); }
  get fin() { return this.mandatForm.get('fin'); }
  get reference() { return this.mandatForm.get('reference'); }
  get description() { return this.mandatForm.get('description'); }
  get actif() { return this.mandatForm.get('actif'); }
  get mandant() { return this.mandatForm.get('mandant'); }
  get mandataire() { return this.mandatForm.get('mandataire'); }
  get pieceJointe() {return this.mandatForm.get("pieceJointe")};



  @Output("changeMandat")
  public changeMandat: EventEmitter<Mandat> = new EventEmitter<Mandat>();


  @ViewChild(DropzoneComponent, { static: false })
  dropzoneComponentRef?: DropzoneComponent;

  //[disabled]="mandatId"

  public mandatRemoteAutocomplete = new RemoteAutocomplete<Mandat>();

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
  public iterableDiffer;
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    public mandatService: MandatService,
    private mediaObserver: MediaObserver,
    private _adapter: DateAdapter<any>,
    public contribuableService: ContribuableService,
    private iterableDiffers: IterableDiffers
    ) {
      this.iterableDiffer = iterableDiffers.find([]).create(null);
    }



ngDoCheck() {

  let changes = this.iterableDiffer.diff(this.filteredListMandat);
  if (changes) {
     //// console.log('Changes detected! filteredListMandat');
      this.mandatRemoteAutocomplete.filtersId= this.filteredListMandat;
      this.mandatRemoteAutocomplete.term.next("");
  }
}
    public activeMediaQuery = '';

    ngAfterContentInit() {


      this.mediaObserver.media$.subscribe((change: MediaChange) => {
        this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
      });

      setTimeout(() => {
        if(this.withMandat && this.id.value>0) {
             this.disableElementForm();
           }
      });


    }
  ngOnInit(): void {
    this._adapter.setLocale("fr");

    if(this.withMandat &&  this.id.value>0) {
      let mandat = new Mandat()
      mandat.id=this.id.value;
      mandat.objet=this.objet.value;
      mandat.debut=this.debut.value;
      mandat.fin=this.fin.value;
      mandat.description=this.description.value;
      mandat.reference=this.reference.value;
      mandat.actif=this.actif.value;
      mandat.mandataire=this.mandataire.value;

      this.mandatRemoteAutocomplete.listRessource$=of([mandat]);
      this.mandatRemoteAutocomplete.initialList = [mandat];
      this.mandatId=this.id.value;
     // this.disableElementForm();


    }


    setTimeout(() => {
      if(this.withMandataire && this.mandataire.value) {
        this.mandataireRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([this.mandataire.value]);
        this.mandataireRemoteAutocomplete.initialList = [this.mandataire.value];
       this.mandataire.setValue(this.mandataire.value.guid);
      }

  });


    if(this.withMandant && this.mandant.value) {

      this.mandantRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([this.mandant.value]);
      this.mandantRemoteAutocomplete.initialList = [this.mandant.value];
     this.mandant.setValue(this.mandant.value.guid);
    }

    if(this.mandatForm.value.pieceJointe) {
      this.documentPiece=this.mandatForm.value.pieceJointe;
      this.pieceJointe.setValue(null);
    }


    if(this.withMandataire){
      this.initConfigAutocompleteMandataire();
    }

    if(this.withMandant){
      this.initConfigAutocompleteMandant();
    }

    if(this.withMandat){
      this.mandatRemoteAutocomplete.params.set("mandant",this.choixMandant.guid);
      this.mandatRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.mandatService);
      this.mandant.setValue(this.choixMandant.guid);
    }
    if(this.choixMandataire){
      this.mandataire.setValue(this.choixMandataire.guid);
    }

  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

 
   
  public onSearchMandat(eventNgSelect){
    this.mandatRemoteAutocomplete.term.next(eventNgSelect.term);


  }
  public onChangeMandat(mandat:Mandat){
   if(mandat){
     //console.log("chnage mandat",mandat)
     this.mandatForm.patchValue({
         objet:mandat.objet,
         description:mandat.description,
         reference:mandat.reference,
         debut:mandat.debut,
         fin:mandat.fin,
         actif:mandat.actif
     });
     this.documentPiece=mandat.pieceJointe;

     this.mandataireRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([mandat.mandataire]);
     this.mandataireRemoteAutocomplete.initialList = [mandat.mandataire];
      this.mandataire.setValue(mandat.mandataire.guid);

    this.disableElementForm();
    this.id.setValue(mandat.id);
    this.changeMandat.emit(mandat);
   }else {

    this.enableElementForm();
    this.mandatForm.reset();
    this.documentPiece=null;
    this.changeMandat.emit(null);
   }
   this.objet.updateValueAndValidity();
  }


  public disableElementForm(){
    this.objet.disable({
      onlySelf:true,
      emitEvent:true
    });
    this.debut.disable({
      onlySelf:true,
      emitEvent:true
    });
    this.fin.disable({
      onlySelf:true,
      emitEvent:true
    });
    this.reference.disable({
      onlySelf:true,
      emitEvent:true
    });
    this.description.disable({
      onlySelf:true,
      emitEvent:true
    });

    this.actif.disable({
      onlySelf:true,
      emitEvent:true
    });
    this.mandant.disable({
      onlySelf:true,
      emitEvent:true
    });
    this.mandataire.disable({
      onlySelf:true,
      emitEvent:true
    });
    this.pieceJointe.disable({
      onlySelf:true,
      emitEvent:true
    });

    this.dropzoneComponentRef.disabled=true;
  }
  public enableElementForm(){
    this.objet.enable({
      onlySelf:true,
      emitEvent:true
    });
    this.debut.enable({
      onlySelf:true,
      emitEvent:true
    });
    this.fin.enable({
      onlySelf:true,
      emitEvent:true
    });
    this.reference.enable({
      onlySelf:true,
      emitEvent:true
    });
    this.description.enable({
      onlySelf:true,
      emitEvent:true
    });

    this.actif.enable({
      onlySelf:true,
      emitEvent:true
    });
    this.mandant.enable({
      onlySelf:true,
      emitEvent:true
    });
    this.mandataire.enable({
      onlySelf:true,
      emitEvent:true
    });
    this.pieceJointe.enable({
      onlySelf:true,
      emitEvent:true
    });

    this.dropzoneComponentRef.disabled=false;
  }

  public onUploadError(args: any): void {
    this.dropzoneComponentRef.directiveRef.reset();
  }
  public resetDropZone(): void {
    this.dropzoneComponentRef.directiveRef.reset();
    this.pieceJointe.setValue(null);
  }
  public onUploadSuccess(remoteResponse): void {
   this.pieceJointe.setValue(remoteResponse[1].name);
  }
  public onUploadInit(args: any): void {

  }

  public mandataireChoisie: GeneralContribuable;
  public mandantChoisie: GeneralContribuable;


  public dialogRefRapideContribuableForm: MatDialogRef<RapideContribuableFormComponent,any>;

  openFormAddModal($event, origine) {
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
       if(origine==="mandataire") {
        if(data){
          this.mandataireRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([data]);
          this.mandataireRemoteAutocomplete.initialList = [data];
          this.mandataireChoisie=data;
          this.mandataire.setValue(data.guid);
         }
       }

       if(origine==="mandant") {
        if(data){
          this.mandantRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([data]);
          this.mandantRemoteAutocomplete.initialList = [data];
          this.mandantChoisie=data;
          this.mandant.setValue(data.guid);
         }
       }
    });
  }

  public mandataireRemoteAutocomplete = new AdvancedRemoteAutocomplete<GeneralContribuable>();
  public mandantRemoteAutocomplete = new AdvancedRemoteAutocomplete<GeneralContribuable>();

  receiveSubjectMandataire(contri: GeneralContribuable) {
    this.mandataireChoisie = contri;
  }

  receiveSubjectMandant(contri: GeneralContribuable) {
    this.mandantChoisie = contri;
  }
  initConfigAutocompleteMandataire() {

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
    this.mandataireRemoteAutocomplete.customNgSelectConfig = {
      multiple: false,
      controlName: 'mandataire',
      libelle: 'libelle',
      callbackAutocomplete: callbackAutocomplete,
      term: new Subject<string>(),
      formulaire: this.mandatForm,
      placeholder: ""
    };

    this.mandataireRemoteAutocomplete.nativeNgSelectConfig.placeholder = "Le mandataire";
    this.mandataireRemoteAutocomplete.nativeNgSelectConfig.appendTo = 'body';
    this.mandataireRemoteAutocomplete.nativeNgSelectConfig.bindValue = 'guid';
    this.mandataireRemoteAutocomplete.listItemSelected = [];
    this.mandataireRemoteAutocomplete.keyId = 'guid';
    this.mandataireRemoteAutocomplete.callbackAutocomplete = callbackAutocomplete;
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
    this.mandataireRemoteAutocomplete.mapFunction= (value : GeneralContribuable):GeneralContribuable=>{
      value.libelleTelephone = value.telephones.map(value => value.value).join(', ');
      value.libelleEmail =  value.emails.map(value => value.value).join(', ');
      return value;
    };
    this.mandataireRemoteAutocomplete.tableDescription = this.mandataireRemoteAutocomplete.pushColumn(colTabAttributaire, 'Liste des mandataires');

  }

  initConfigAutocompleteMandant() {

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
    this.mandantRemoteAutocomplete.customNgSelectConfig = {
      multiple: false,
      controlName: 'mandant',
      libelle: 'libelle',
      callbackAutocomplete: callbackAutocomplete,
      term: new Subject<string>(),
      formulaire: this.mandatForm,
      placeholder: ""
    };

    this.mandantRemoteAutocomplete.nativeNgSelectConfig.placeholder = "Le mandant";
    this.mandantRemoteAutocomplete.nativeNgSelectConfig.appendTo = 'body';
    this.mandantRemoteAutocomplete.nativeNgSelectConfig.bindValue = 'guid';
    this.mandantRemoteAutocomplete.listItemSelected = [];
    this.mandantRemoteAutocomplete.keyId = 'guid';
    this.mandantRemoteAutocomplete.callbackAutocomplete = callbackAutocomplete;
    const colTabMandant = [
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
    this.mandantRemoteAutocomplete.mapFunction= (value : GeneralContribuable):GeneralContribuable=>{
      value.libelleTelephone = value.telephones.map(value => value.value).join(', ');
      value.libelleEmail =  value.emails.map(value => value.value).join(', ');
      return value;
    };
    this.mandantRemoteAutocomplete.tableDescription = this.mandantRemoteAutocomplete.pushColumn(colTabMandant, 'Liste des mandants');

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
