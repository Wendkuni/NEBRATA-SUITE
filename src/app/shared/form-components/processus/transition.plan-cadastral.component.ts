
import { Input, Directive } from '@angular/core';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { MediaObserver } from '@angular/flex-layout';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Transition, Dossier, DossierPiece } from '@sycadApp/models/workflow/common/general';
import {RemoteAutocomplete} from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { BureauAutocomplete } from '@sycadApp/models/data-references/organigramme/bureau.model';
import {StructureAutocomplete} from '@sycadApp/models/data-references/organigramme/structure.model';
import {ServiceAutocomplete} from '@sycadApp/models/data-references/organigramme/service.model';
import { TransitionComponent } from './transition/component.transition';


@Directive()
export class TransitionPlanCadastralComponent <DOSSIER extends Dossier> extends TransitionComponent {


  @Input()
  public planCadastral: DOSSIER;
  @Input()
  public transition: Transition;
  public bureauRemoteAutocomplete = new RemoteAutocomplete<BureauAutocomplete>();
  public structureRemoteAutocomplete = new RemoteAutocomplete<StructureAutocomplete>();
  public serviceRemoteAutocomplete = new RemoteAutocomplete<ServiceAutocomplete>();

  get bureau(){ return this.formulaire.get('transmission').get('bureau');}
  get service(){ return this.formulaire.get('transmission').get('service');}
  get structure(){ return this.formulaire.get('transmission').get('structure');}
  get transmission(){ return this.formulaire.get('transmission');}
  domaines = [
    "ETAT",
    "PARTICULIER",
    "COLLECTIVITE"
  ];
  zones = [
    "URBAIN",
    "RURAL",
    "SUBURBAIN"
  ];

  get pieces() { return this.formulaire.controls.pieces as FormArray; }

  get dossier() { return this.formulaire.get('dossier'); }
  get transmissionCreateur() {return this.formulaire.get('transmissionCreateur')}


  get zone() { return this.formulaire.get('zone');}
  get domaine() {return this.formulaire.get('domaine');}
  get dateMajPlan() {return this.formulaire.get('dateMajPlan');}


  constructor(
    public router: Router,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder){
     super(mediaObserver);


     this.formulaire = this.fb.group({
      dossier : this.fb.group({
        objet: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
        dateExterne: [null, Validators.compose([Validators.required])],
        etatDossier: [null || false],
        refExterne: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
        observation: [null],
      }),
  /*   transmission : this.fb.group({
       bureau: [null],
       service: [null],
       structure: [null]
     }),*/
      dateMajPlan: [null, Validators.compose([Validators.required])],
      zone: [null, Validators.compose([Validators.required])], //URBAIN("URBAIN"), RURAL("RURAL"), SUBURBAIN("SUBURBAIN")
      domaine: [null, Validators.compose([Validators.required])], //ETAT("ETAT"), PARTICULIER("PARTICULIER"), COLLECTIVITE("COLLECTIVITE");
     // sections: new FormArray([]),
     pieces: new FormArray([]),
    });
  }



   /**************** piece officielle *********************/

   createDossierPiece(piece:DossierPiece=null) {

    if(piece!=null) {


      return this.fb.group({
        id: [piece.id],
        categorie: [piece.categorie, Validators.compose([Validators.required])],
        reference: [piece.reference, Validators.compose([Validators.required])],
        dateExpiration: [piece.dateExpiration, Validators.compose([Validators.required])],
        dateDelivrance: [piece.dateDelivrance, Validators.compose([Validators.required])],
        autoriteDeDelivrance: [piece.autoriteDeDelivrance, Validators.compose([Validators.required])],
        observation: [piece.observation],
        pieceJointe: [piece.pieceJointe],
      });
    }else {
      return this.fb.group({
        id: [null],
        categorie: [null, Validators.compose([Validators.required])],
        reference: [null, Validators.compose([Validators.required])],
        dateExpiration: [null, Validators.compose([Validators.required])],
        dateDelivrance: [null, Validators.compose([Validators.required])],
        autoriteDeDelivrance: [null, Validators.compose([Validators.required])],
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

  /*resetForm(){
    if(this.planCadastral.numero) {
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_SECTIONNEMENT}`]);
    }else {
      this.formulaire.reset();
    }
  }
*/

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }
}
