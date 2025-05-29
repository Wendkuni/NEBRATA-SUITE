import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import {CategoriePieceProcessus, Dossier, DossierPiece, Transition, Transmission} from '@sycadApp/models/workflow/common/general';
import { TransitionComponent } from '@sycadApp/shared/form-components/processus/transition/component.transition';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { DateAdapter } from '@angular/material/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import {AffecationMinimumExist, getErrors} from '@sycadApp/shared/validators/global-pattern';
import {GenericProcessusDatasource} from '@sycadApp/models/generic-datasource-processus';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import {RemoteAutocomplete} from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { BureauAutocomplete } from '@sycadApp/models/data-references/organigramme/bureau.model';
import {StructureAutocomplete} from '@sycadApp/models/data-references/organigramme/structure.model';
import {ServiceAutocomplete} from '@sycadApp/models/data-references/organigramme/service.model';
import { BureauService } from '@sycadApp/services/data-references/organigramme/bureau.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import { ServiceAdministratifService } from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';

import {of} from 'rxjs';

@Component({
  selector: 'app-transmission-dossier',
  templateUrl: './transmission.component.html',
  styleUrls: ['./transmission.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransmissionComponent  extends TransitionComponent implements OnInit {


  @Input()
  public dossierProcessus: Dossier;

  @Input()
  public transition: Transition;

  @Input()
  public processusService: GenericProcessusDatasource<Dossier, Dossier>;

  @Input()
  public frontendUrl: String;

  @Input()
  public codeCommune: String;

  @Input()
  public avecPiece: Boolean;

  @Input()
  public codeArrrondissement: String;

  @Input()
  public codeTransition: String;

  @Input("fixedStructures")
  public fixedStructures: boolean;

  @Input("hideBureau")
  public hideBureau: boolean = false;

    public bureauRemoteAutocomplete = new RemoteAutocomplete<BureauAutocomplete>();
    public structureRemoteAutocomplete = new RemoteAutocomplete<StructureAutocomplete>();
    public serviceRemoteAutocomplete = new RemoteAutocomplete<ServiceAutocomplete>();

    get bureau(){ return this.formulaire.get('transmission').get('bureau');}
    get service(){ return this.formulaire.get('transmission').get('service');}
    get structure(){ return this.formulaire.get('transmission').get('structure');}
    get transmission(){ return this.formulaire.get('transmission');}
    get dossier() { return this.formulaire.get('dossier'); }
    get pieces() { return this.formulaire.controls.pieces as FormArray; }

  constructor(
    public router: Router,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,public bureauService : BureauService, public structureService : StructureService,
    public serviceAdminService : ServiceAdministratifService){
     super(mediaObserver);


     this.formulaire = this.fb.group({
        action: [null, Validators.compose([Validators.required])],
        numero: [null, Validators.compose([Validators.required])],
        dossier : this.fb.group({
          observation: [null]
        }),
        transmission : this.fb.group({
          bureau: [null],
          service:[null],
          structure: [null]
        },{
          validator: AffecationMinimumExist()
        }),
      });
     // this.fb.array

  }
 /* , {

} */
  ngOnInit(): void {
  

    if(this.avecPiece) {
      this.formulaire.addControl('pieces', new FormArray([]));
    }

    this.formulaire.patchValue({
      numero: this.dossierProcessus.numero,
      action: this.transition.code,
      transmission: {
       bureau: this.dossierProcessus.transmission?.bureau?.id,
        service: this.dossierProcessus.transmission?.service?.id,
        structure: this.dossierProcessus.transmission?.structure?.id,
      }
    });


    if(this.codeCommune) {
      this.structureRemoteAutocomplete.params.set("commune",this.codeCommune)
    }

    if(this.codeArrrondissement) {
      this.structureRemoteAutocomplete.params.set("arrondissement",this.codeArrrondissement)
    }

    if(this.codeTransition) {
      this.structureRemoteAutocomplete.params.set("transition",this.codeTransition)
    }

    this._adapter.setLocale("fr");


    if(this.dossierProcessus.transmission?.bureau) {
      this.bureauRemoteAutocomplete.listRessource$ = of([this.dossierProcessus.transmission.bureau]);
      this.bureauRemoteAutocomplete.initialList = [this.dossierProcessus.transmission.bureau];
      this.bureau.setValue(this.dossierProcessus.transmission.bureau.id);
    }
    if(this.dossierProcessus.transmission?.structure) {

      this.structureRemoteAutocomplete.listRessource$ = of([this.dossierProcessus.transmission.structure]);
      this.structureRemoteAutocomplete.initialList = [this.dossierProcessus.transmission.structure];
      this.structure.setValue(this.dossierProcessus.transmission.structure.id);
      this.serviceRemoteAutocomplete.params.set("structure",this.dossierProcessus.transmission.structure.code);
      this.bureauRemoteAutocomplete.params.set("structure",this.dossierProcessus.transmission.structure.code);
    }
    if(this.dossierProcessus.transmission?.service) {
      this.serviceRemoteAutocomplete.listRessource$ = of([this.dossierProcessus.transmission.service]);
      this.serviceRemoteAutocomplete.initialList = [this.dossierProcessus.transmission.service];
      this.service.setValue(this.dossierProcessus.transmission.service.id)
      this.bureauRemoteAutocomplete.params.set("service",this.dossierProcessus.transmission.service.code);
    }


    if(this.fixedStructures) {

      let structure = this.dossierProcessus.transmission.structure;
      this.structureRemoteAutocomplete.fixedItem=[structure];

     // this.serviceRemoteAutocomplete.resetParams();
     // this.bureauRemoteAutocomplete.resetParams();
      this.serviceRemoteAutocomplete.params.set("structure",structure.code);
      this.bureauRemoteAutocomplete.params.set("structure",structure.code);
      if(this.dossierProcessus.transmission?.service){
        this.bureauRemoteAutocomplete.params.set("service",this.dossierProcessus.transmission.service.code);
      }

    }

    this.bureauRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.bureauService);
    this.serviceRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.serviceAdminService);
    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.structureService);


    this.categoriePieceProcessus$ = this.transition?.categoriePieces;

    
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }
  customSearchFn(term: string, item: any) {
    return 1;
 }
  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }
    this.loadingEvent.emit(true);
 let {numero,action,transmission,pieces}=this.formulaire.value;
    let {observation}=this.formulaire.value.dossier;
    let dataPost= {
      numero,action,observation,transmission,pieces
    };
    this.processusService.executer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
        this.openSnackBar('Le dossier a été transmis avec succès', 'OK');
        this.router.navigate([this.frontendUrl]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }

 public onSearchBureau(eventNgSelect) {
   this.bureauRemoteAutocomplete.term.next(eventNgSelect.term);
 }
 public onSearchService(eventNgSelect) {
   this.serviceRemoteAutocomplete.term.next(eventNgSelect.term);
 }
 public onSearchStructure(eventNgSelect) {
   this.structureRemoteAutocomplete.term.next(eventNgSelect.term);
 }


 public onChangeStructure(structure:StructureAutocomplete) {

  this.serviceRemoteAutocomplete.resetParams();
  this.service.reset();

  this.bureauRemoteAutocomplete.resetParams();
  this.bureau.reset();
  this.serviceRemoteAutocomplete.initialList=[];
  this.bureauRemoteAutocomplete.initialList=[];
  if(structure){
    this.serviceRemoteAutocomplete.params.set("structure",structure.code);
    this.serviceRemoteAutocomplete.term.next("");


    this.bureauRemoteAutocomplete.params.set("structure",structure.code);
    this.bureauRemoteAutocomplete.term.next("");
  }


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
  this.categoriePieceProcessus$ = this.transition?.categoriePieces.filter((piece) => {
    return (that.idCategoriePieceListChosen$.indexOf(piece.id) < 0);
  });

}
addNewDossierPiece() {
  if (this.categoriePieceProcessus$.length > 0) {
    this.pieces.insert(0, this.createDossierPiece());
  }
}
removeDossierPiece(index) {
  this.pieces.removeAt(index);
  this.changeCategoriePiece(null);
}

public onChangeService(service:ServiceAutocomplete) {

  this.bureauRemoteAutocomplete.resetParams();
  this.bureau.reset();

  this.bureauRemoteAutocomplete.initialList=[];
  if(service) {
    this.bureauRemoteAutocomplete.params.set("service",service.code);
    this.bureauRemoteAutocomplete.term.next("");
  }

}

  resetForm() {
    if (this.dossierProcessus.numero) {
      this.router.navigate([`${this.frontendUrl}`]);
    } else {
      this.formulaire.reset();
    }
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



  /**************** fin piece officielle *********************/

}
