import { SituationMatrimonialeAutocomplete } from './../../../../models/data-references/contribuables/global.model';
import { AdresseContribuable } from '@sycadApp/models/data-references/contribuables/global.model';
import { Component, Inject, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import {  Output, EventEmitter, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import {ContribuablePhysiqueService} from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';
import { FilterContextategoriePiece, RemoteAutocomplete, RemoteAutocompleteCategoriePiece } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { GeneralContribuable, ProfessionAutocomplete } from '@sycadApp/models/data-references/contribuables/global.model';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { AttributsExist } from '@sycadApp/shared/validators/remote/attributs-exist';
import { Subject, of } from 'rxjs';
import { ContactContribuableService } from '@sycadApp/services/data-references/system/contact.service';
import { RechercheContribuableIFU } from '../../data-references-domaine/recherche-ifu/recherche-ifu.component';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { RechercheContribuableONI } from '../../data-references-domaine/recherche-oni/recherche-oni.component';
import { ContribuablePhysiqueElement } from '@sycadApp/models/data-references/contribuables/contribuable-physique.model';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { AdresseMinimumExist, GlobalPattern } from '@sycadApp/shared/validators/global-pattern';
import { Contact } from '@sycadApp/models/data-references/system/model';
import { SituationMatrimonialeService } from '@sycadApp/services/data-references/system/situationMatrimoniale.service';

@Component({
  selector: 'app-rapide-contribuable-physique-form',
  templateUrl: './rapide-contribuable-physique-form.component.html',
  styleUrls: ['./rapide-contribuable-physique-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RapideContribuablePhysiqueFormComponent implements OnInit {
  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  // Je l'ajoute pour l'utiliser comme constante de categoriePiece
  private contribuableType = 'CONTRIBUABLEPHYSIQUE';

  @Input("updateContribuable")
  public updateContribuable: String = null;

  public contribuableUpdate: ContribuablePhysiqueElement = null;

  public professionRemoteAutocomplete = new RemoteAutocomplete<ProfessionAutocomplete>();
  public situationMatrimonialeAutocomplete = new RemoteAutocomplete<SituationMatrimonialeAutocomplete>();
  public typePieceIdentiteRemoteAutocomplete = new RemoteAutocompleteCategoriePiece();

  public maySearchOniOrIfu:boolean = false;
  public mayFillForm:boolean = false;
  public categoriePieceSelectionnee:string = "";
  public initialTypePiece:string = "";
  public initialTypePieceId:number = 0;
  public isLoadingResults = false;
  public today: Date = new Date();

  @Output("ajouterContribuable")
  public ajouterContribuable: EventEmitter<GeneralContribuable> = new EventEmitter<GeneralContribuable>();


  get prenoms() { return this.formulaire.get('prenoms'); }
  get nom() { return this.formulaire.get('nom'); }
  get nomJeuneFille() { return this.formulaire.get('nomJeuneFille'); }
  get dateNaissance() { return this.formulaire.get('dateNaissance'); }
  get lieuNaissance() { return this.formulaire.get('lieuNaissance'); }
  get prenomsMere() { return this.formulaire.get('prenomsMere'); }
  get nomPere() { return this.formulaire.get('nomPere'); }
  get prenomsPere() { return this.formulaire.get('prenomsPere'); }
  get nomMere() { return this.formulaire.get('nomMere'); }
  get profession() { return this.formulaire.get('profession'); }
  get situationMatrimoniale() { return this.formulaire.get('situationMatrimoniale'); }
  get pieceOfficielle() { return this.formulaire.get('pieceOfficielle'); }
  // Je récupère la valeur de pieceOfficielle.categorie
  get categorie() {return this.pieceOfficielle.get("categorie");}

  get adresses() { return this.formulaire.controls.adresses as FormArray ;}
  get emails() { return this.formulaire.get("emails") as FormArray;}
  get telephones() { return this.formulaire.get("telephones") as FormArray;}

  constructor(public dialogRef: MatDialogRef<RapideContribuablePhysiqueFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar,
              public fb: FormBuilder,
              public confirmService:AppConfirmService,
              public professionService:ProfessionService,
              public situationMatrimonialeService: SituationMatrimonialeService,
              public contribuablePhysiqueService:ContribuablePhysiqueService,
              public typePieceIdentiteService: CategoriePieceService,
              public contactContribuableService: ContactContribuableService)
  {
    this.formulaire = this.fb.group({
      guid: null,
      categorie: [null, Validators.compose([Validators.required])],
      prenoms: [null, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
      nom: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      nomJeuneFille: [null],
      dateNaissance: [null],
      lieuNaissance: [null],
      prenomsPere: [null],
      nomPere: [null],
      prenomsMere: [null],
      nomMere: [null],
      profession: [null],
      situationMatrimoniale: [null, Validators.compose([Validators.required])],
      genre: [null,Validators.compose([Validators.required])],
      pieceOfficielle:this.fb.group({
        categorie: [null],
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

      adresses: new FormArray([]),
      emails: new FormArray([]),
      telephones: new FormArray([]),
    });
  }

  autoriserEdition(autorise:boolean = true){
    if(autorise){
      this.formulaire.controls.prenoms.enable();
      this.formulaire.controls.nom.enable();
      this.formulaire.controls.nomJeuneFille.enable();
      this.formulaire.controls.dateNaissance.enable();
      this.formulaire.controls.lieuNaissance.enable();
      this.formulaire.controls.nomPere.enable();
      this.formulaire.controls.nomMere.enable();
      this.formulaire.controls.profession.enable();
      this.formulaire.controls.genre.enable();
      this.formulaire.controls.pieceOfficielle['controls'].dateObtention.enable();
      this.formulaire.controls.pieceOfficielle['controls'].numero.enable();
      this.formulaire.controls.pieceOfficielle['controls'].dateExpiration.enable();
      this.formulaire.controls.pieceOfficielle['controls'].nip.enable();
      this.formulaire.controls.pieceOfficielle['controls'].autoriteDeDelivrance.enable();
      this.formulaire.controls.pieceOfficielle['controls'].lieuDeDelivrance.enable();
      this.formulaire.controls.pieceOfficielle['controls'].codeDownload.enable();
    } else {
      this.formulaire.controls.prenoms.disable();
      this.formulaire.controls.nom.disable();
      this.formulaire.controls.nomJeuneFille.disable();
      this.formulaire.controls.dateNaissance.disable();
      this.formulaire.controls.lieuNaissance.disable();
      this.formulaire.controls.nomPere.disable();
      this.formulaire.controls.nomMere.disable();
      this.formulaire.controls.profession.disable();
      this.formulaire.controls.genre.disable();
      this.formulaire.controls.pieceOfficielle['controls'].dateObtention.disable();
      this.formulaire.controls.pieceOfficielle['controls'].numero.disable();
      this.formulaire.controls.pieceOfficielle['controls'].dateExpiration.disable();
      this.formulaire.controls.pieceOfficielle['controls'].nip.disable();
      this.formulaire.controls.pieceOfficielle['controls'].autoriteDeDelivrance.disable();
      this.formulaire.controls.pieceOfficielle['controls'].lieuDeDelivrance.disable();
      this.formulaire.controls.pieceOfficielle['controls'].codeDownload.disable();
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.updateContribuable) {

      this.contribuablePhysiqueService.get(changes.updateContribuable.currentValue).subscribe(data =>{
        this.contribuableUpdate = data;

        if(data != null){
          this.formulaire.patchValue({
            nom: data.nom,
            nomJeuneFille: data.nomDeJeuneFille,
            prenoms: data.prenoms,
            genre: data.genre,
            profession: data.profession?.id,
            dateNaissance: data.dateNaissance,
            lieuNaissance: data.lieuNaissance,
            nomPere: data.nomPere,
            nomMere: data.nomMere,
            pieceOfficielle: data.pieceOfficielle,
            situationMatrimoniale: data.situationMatrimoniale?.id,
            categorie: data.pieceOfficielle?.categorie.id
          });

          if (this.contribuableUpdate.telephones) {
            this.contribuableUpdate.telephones.map((telephone) => {
              this.telephones.insert(0, this.createTelephone(telephone));
          });
          }

          if (this.contribuableUpdate.emails) {
            this.contribuableUpdate.emails.map((mail) => {
              this.emails.insert(0, this.createEmail(mail));
          });
          }
          if (this.contribuableUpdate.adresses) {
            this.contribuableUpdate.adresses.map((adresse) => {
              this.adresses.insert(0, this.createAdresse(adresse));
          });
          }

          this.initialTypePiece = data.pieceOfficielle?.categorie.code;
          this.initialTypePieceId = data.pieceOfficielle?.categorie.id;

          this.pieceOfficielle.patchValue({
            categorie: this.formulaire.controls.categorie.value,
          });
          this.formulaire.value.pieceOfficielle = data.pieceOfficielle;

          if(this.initialTypePiece == '01' || this.initialTypePiece == '03'){
            this.autoriserEdition(false);
          }

          this.maySearchOniOrIfu = false;
          this.mayFillForm = true;
        }
      }, errorResponse => {
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      });
    }
  }

  ngOnInit(): void {

    this.professionRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.professionService);
    this.situationMatrimonialeAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.situationMatrimonialeService);

   if(this.pieceOfficielle.value?.categorie) {
    this.typePieceIdentiteRemoteAutocomplete.listRessource$=of([this.pieceOfficielle.value.categorie]);
    this.typePieceIdentiteRemoteAutocomplete.initialList=[this.pieceOfficielle.value.categorie];

    this.pieceOfficielle.patchValue({
      categorie: this.pieceOfficielle.value.categorie.id
    });
    }

    this.typePieceIdentiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.typePieceIdentiteService, true);
    // Appliquer une recherche avec rien par défaut pour charger la liste complète. ( les données doivent être indexées )
   this.typePieceIdentiteRemoteAutocomplete.term.next(new FilterContextategoriePiece("",this.contribuableType));

    // Mettre la cnib par défaut, donc la pièce ayant l'id 1
    this.formulaire.patchValue({
      categorie : 1
    });

   // Appliquer les modifications de formulaire liées à ce type de pièce
   this.onChangeypePieceIdentite({
    'code': "01"
   });
  }

  public onSearchProfession(eventNgSelect) {
    this.professionRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchSituationMatrimoniale(eventNgSelect) {
    this.situationMatrimonialeAutocomplete.term.next(eventNgSelect.term);
  }

  trouveContribuable(rechercheContribuableIFU: RechercheContribuableIFU){
    if(!rechercheContribuableIFU.success){
      SycadUtils.notifyRemoteError( {message: rechercheContribuableIFU.message}, this._snackBar);
    }else {
      this.openSnackBar("Un résultat a été trouvé","OK");
    }
  }

  trouveContribuableOni(rechercheContribuableONI: RechercheContribuableONI){
    if(!rechercheContribuableONI.success){
      SycadUtils.notifyRemoteError( {message: rechercheContribuableONI.message}, this._snackBar);
    }else {
      this.openSnackBar("Un résultat a été trouvé","OK");
    }
  }

  public onChangeypePieceIdentite(event) {
    this.categoriePieceSelectionnee = event.code;

    // Si c'est passeport ou cnib, et si en mode édition ce n'est pas le type de pièce du contribuable existant, bloquer le reste des champs
    if((event.code == '01' || event.code == '03') && event.code != this.initialTypePiece){
      this.maySearchOniOrIfu = true;
      this.mayFillForm = false;
    }
    // Si c'est passeport ou cnib et qu'en mode édition, c'est le type de pièce du contribuable existant, afficher le formulaire mais en grisant les champs non éditables
    else if((event.code == '01' || event.code == '03') && event.code == this.initialTypePiece){
      this.maySearchOniOrIfu = false;
      this.mayFillForm = true;

      // Puisque j'ai enlevé l'autre champ du composant, je le syncronise avec celui-ci. Systématiquement dès que mayFillForm devient true.
      this.pieceOfficielle.patchValue({
        categorie: this.formulaire.controls.categorie.value,
      });

      this.autoriserEdition(false);
    }
    // Si c'est passeport ou cnib, empêcher de passer vers un autre type de pièce
    else if((this.initialTypePiece == '01' || this.initialTypePiece == '03') && (event.code != '01' && event.code != '03') ){
      this.openSnackBar("Impossible de passer vers ce type de pièce.","Info");
      this.formulaire.patchValue({
        categorie: this.initialTypePieceId
      })
    }
    // Si on passe d'un autre type de pièce vers un autre type de pièce, autoriser l'édition du formulaire.
    else {
      this.autoriserEdition(true);
      this.maySearchOniOrIfu = false;
      this.mayFillForm = true;

      // Puisque j'ai enlevé l'autre champ du composant, je le syncronise avec celui-ci. Systématiquement dès que mayFillForm devient true.
      this.pieceOfficielle.patchValue({
        categorie: this.formulaire.controls.categorie.value,
       });
    }
  }

  public onSearchTypePieceIdentite(eventNgSelect) {
    let data = new FilterContextategoriePiece(eventNgSelect.term,this.contribuableType)
    this.typePieceIdentiteRemoteAutocomplete.term.next(data);
  }

  importContribuable(contribuable: GeneralContribuable) {
    if(contribuable){
      this.ajouterContribuable.emit(contribuable);
    }
  }

  /**************** adresse *********************/
  createAdresse(adresse:AdresseContribuable) {
    if(adresse) {
      return this.fb.group({
        id: [adresse.id],
        libelle: [adresse.libelle],
        principal: [adresse.principal],
        localite: [adresse.localite],
        rue: [adresse.rue],
        porte: [adresse.porte],
        quartier: [adresse.quartier],
        ville: [adresse.ville, Validators.compose([Validators.required])],
        pays: [adresse.pays, Validators.compose([Validators.required])]
      },{
        validator: AdresseMinimumExist()
      });
    }else {
      return this.fb.group({
        id: [null],
        libelle: [null],
        principal: [false],
        localite: [null],
        rue: [null],
        porte: [null],
        quartier: [null],
        ville: [null, Validators.compose([Validators.required])],
        pays: [null, Validators.compose([Validators.required])]
      },{
        validator: AdresseMinimumExist()
      });
    }
  }
  addNewAdresse(){
    this.adresses.insert(0, this.createAdresse(null));

  }

  removeAdresse(index) {
    let adresse = this.adresses.at(index);
    if (adresse.value.id) {
      this.confirmService.confirm({
        title:"Confirmation",
        message:`Voulez-vous supprimer cette adresse Email ? `
      }).subscribe(($choix)=> {
        if($choix) {
          this.isLoadingResults=true;
          this.contactContribuableService.deleteAdresse(this.formulaire.value.guid,adresse.value.id).subscribe(
            (result) => {
              this.isLoadingResults=false;
              this.openSnackBar("Element supprimé avec succès", "OK");
              this.adresses.removeAt(index);
            },
            (errorResponseMembre) => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponseMembre.error, this._snackBar);
            }
          );
        }

      });
    } else {
      this.adresses.removeAt(index);
    }
  }

  public onChangeAdressePrincipal(adresse) {
    this.adresses.controls.forEach(adresseCtl => {
      if(adresseCtl!==adresse) {
        adresseCtl.patchValue({
          principal: false
        });
      }

    });
  }

  addNewEmail() {
    this.emails.insert(0, this.fb.group({
      id: [null],
      principal: [false],
      level: ["PROFESSIONAL", Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required, Validators.email]),
      [AttributsExist.validateEmailExistFn(this.contactContribuableService)]]
    }));
  }

  removeEmails(index) {
    let email = this.emails.at(index);
    if (email.value.id) {
      this.confirmService.confirm({
        title:"Confirmation",
        message:`Voulez-vous supprimer cette adresse Email ? `
      }).subscribe(($choix)=> {

        if($choix) {
          this.isLoadingResults=true;
          this.contactContribuableService.deleteEmail(this.formulaire.value.guid,email.value.id).subscribe(
            (result) => {
              this.isLoadingResults=false;
              this.openSnackBar("Element supprimé avec succès", "OK");
              this.emails.removeAt(index);
            },
            (errorResponseMembre) => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponseMembre.error, this._snackBar);
            }
          );
        }

      });
    } else {
      this.emails.removeAt(index);
    }
  }

  public onChangeEmailPrincipal(email) {
    this.emails.controls.forEach(mailCtl => {
      if(mailCtl!==email) {
        mailCtl.patchValue({
          principal: false
        });
      }
    });
  }

  createEmail(mail:Contact) {
    if(mail) {
      return this.fb.group({
        id: [mail.id],
        principal: [mail.principal],
        level: [mail.level, Validators.compose([Validators.required])],
        email: [mail.value, Validators.compose([Validators.required, Validators.email]),
        [AttributsExist.validateEmailExistFn(this.contactContribuableService)]]
      });
    }else {
      return this.fb.group({
        id: [null],
        principal: [false],
        level: ["PROFESSIONAL", Validators.compose([Validators.required])],
        email: [null, Validators.compose([Validators.required, Validators.email]),
        [AttributsExist.validateEmailExistFn(this.contactContribuableService)]]
      });
    }
  }

  /**************** téléphone *********************/

  removeTelephones(index) {
    let telephone = this.telephones.at(index);
    if (telephone.value.id) {
      this.confirmService.confirm({
        title:"Confirmation",
        message:`Voulez-vous supprimer ce  téléphone ? `
      }).subscribe(($choix)=> {

        if($choix) {
          this.isLoadingResults=true;
          this.contactContribuableService.deleteTelephone(this.formulaire.value.guid,telephone.value.id).subscribe(
            (result) => {
              this.isLoadingResults=false;
              this.openSnackBar("Element supprimé avec succès", "OK");
              this.telephones.removeAt(index);
            },
            (errorResponseMembre) => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponseMembre.error, this._snackBar);
            }
          );
        }

      });
    } else {
      this.telephones.removeAt(index);
    }
  }

  public onChangeTelephonePrincipal(telephone) {
    this.telephones.controls.forEach(telCtl => {
      if(telCtl!==telephone) {
        telCtl.patchValue({
          principal: false
        });
      }
    });
  }

  createTelephone(telephone:Contact) {
    if(telephone) {
      return this.fb.group({
        id: [telephone.id],
        principal: [telephone.principal],
        level: [telephone.level, Validators.compose([Validators.required])],
        numero: [telephone.value, Validators.compose([Validators.required, GlobalPattern.patternTelephoneBf])]
      });
    }else {
      return this.fb.group({
        id: [null],
        principal: [false],
        level: ["PROFESSIONAL", Validators.compose([Validators.required])],
        numero: [null, Validators.compose([Validators.required, GlobalPattern.patternTelephoneBf])]
      });
    }
  }
  addNewTelephone() {
    this.telephones.insert(0, this.createTelephone(null));
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }
  onSubmit() {

    if (!this.formulaire.valid) {
      return false;
    } else {

      if (this.formulaire.value) {

        if(this.updateContribuable != null){
          this.formulaire.value.guid = this.updateContribuable;
          this.formulaire.value.pieceOfficielle.categorie = this.formulaire.value.pieceOfficielle.categorie.id;
          this.contribuablePhysiqueService.update(this.formulaire.value).subscribe(
            data => {
              this.dialogRef.close(data);
            },
            errorResponse => {
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
              }
          );
        } else {
        this.contribuablePhysiqueService.add(this.formulaire.value).subscribe(
          data => {
            this.dialogRef.close(data);
          },
          errorResponse => {
            SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
        );
        }
      }


    }

  }


  //
  /*destructure d'instance*/

  closeFormModal(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  /*fin destructure d'instance*/

}
