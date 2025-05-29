import {
  Component,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from "@angular/forms";
import { Subject, of} from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RemoteAutocomplete } from "@sycadApp/shared/form-components/model/remote-autocomplete";
import { RemoteAutocompleteIndivisionMemebrable } from "@sycadApp/shared/form-components/model/remote-autocomplete-guid";
import { DateAdapter } from "@angular/material/core";
import {Civilite, StatusJuridique, ReseauSociaux, Contact} from '@sycadApp/models/data-references/system/model';
import { StatusJuridiqueService } from '@sycadApp/services/data-references/system/status-juridique.service';
import {CiviliteService} from '@sycadApp/services/data-references/system/civilite-service.service';

import {GlobalPattern, AdresseMinimumExist,AffecationMinimumExist, MustMatch, getErrors} from '@sycadShared/validators/global-pattern';
import {
  Nationalite,
  PieceOfficielle,
  AdresseContribuable,
  PersonneAContacter,
  ContribuableElement,
  GeneralContribuable
} from '@sycadApp/models/data-references/contribuables/global.model';

import { NationaliteService } from '@sycadApp/services/data-references/system/nationalite.service';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { PieceOfficielleService } from '@sycadApp/services/data-references/system/piece-officielle.service';

import { ContactContribuableService } from '@sycadApp/services/data-references/system/contact.service';

import {
  NationaliteAutocomplete,
  ProfessionAutocomplete, SituationMatrimonialeAutocomplete, TitreHonorifiqueAutocomplete
} from '@sycadApp/models/data-references/contribuables/global.model';
import {LocaliteAutocomplete} from "@sycadApp/models/data-references/territoire/localite.model";
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { AttributsExist } from '@sycadApp/shared/validators/remote/attributs-exist';
import {ContribuablePhysiqueElement} from "@sycadApp/models/data-references/contribuables/contribuable-physique.model";
import {ContribuablePhysiqueService} from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';
import { SituationMatrimonialeService } from '@sycadApp/services/data-references/system/situationMatrimoniale.service';;
import { takeUntil } from 'rxjs/operators';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { IFUApiService } from "@sycadApp/shared/form-components/data-references-domaine/recherche-ifu/api-ifu.service";
import {  RechercheContribuableIFU } from "@sycadApp/shared/form-components/data-references-domaine/recherche-ifu/recherche-ifu.component";
import { RechercheContribuableONI } from "@sycadApp/shared/form-components/data-references-domaine/recherche-oni/recherche-oni.component";


@Component({
  selector: 'app-form-page-contribuable-physique',
  templateUrl: './form-page-contribuable-physique.component.html',
  styleUrls: ['./form-page-contribuable-physique.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormPageContribuablePhysiqueComponent implements OnInit {
  public formulaire: FormGroup;
  public  contribuable: ContribuablePhysiqueElement;

  public isLoadingResults = false;

  public passwordHide: boolean = true;
  public selectTypeContact = 'EMAIL';
  public isOther:boolean = false;
  public maxDateNaissance;
  public minDateNaissance;
  private _onDestroy = new Subject<void>();
  public civilityRemoteAutocomplete = new RemoteAutocomplete<Civilite>();
  public nationaliteRemoteAutocomplete = new RemoteAutocomplete<Nationalite>();
  public titreHonorifiqueRemoteAutocomplete = new RemoteAutocomplete<TitreHonorifiqueAutocomplete>();
  public localiteRemoteAutocomplete = new RemoteAutocomplete<LocaliteAutocomplete>();
  public nationnaliteRemoteAutocomplete = new RemoteAutocomplete<NationaliteAutocomplete>();
  public professionRemoteAutocomplete = new RemoteAutocomplete<ProfessionAutocomplete>();
  public situationMatrimonialeRemoteAutocomplete = new RemoteAutocomplete<SituationMatrimonialeAutocomplete>();
  public contribuableRemoteAutocomplete = new RemoteAutocompleteIndivisionMemebrable();
  public statusJuridiqueAutocomplete = new RemoteAutocomplete<StatusJuridique>();
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
    //  this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
      //console.log("this.activeMediaQuery",this.activeMediaQuery)
      //this.grid.cols = this.gridByBreakpoint[change.mqAlias];
    });
  }

  get prenoms() { return this.formulaire.get('prenoms'); }
  get nom() { return this.formulaire.get('nom'); }
  get nomDeJeuneFille() { return this.formulaire.get('nomDeJeuneFille'); }
  get situationMatrimoniale() { return this.formulaire.get('situationMatrimoniale'); }
  get profession() { return this.formulaire.get('profession'); }
  get nationalite() { return this.formulaire.get('nationalite');}
  get genre() { return this.formulaire.get('genre'); }
  get civilite() { return this.formulaire.get('civilite'); }
  get lieuNaissance() { return this.formulaire.get('lieuNaissance'); }
  get dateNaissance() { return this.formulaire.get('dateNaissance'); }
 get codeUnique(){return this.formulaire.get('codeUnique');}
  get active() { return this.formulaire.get('active'); }
  get username() { return this.formulaire.get('username'); }
  get guid() { return this.formulaire.get('guid'); }
  get password() { return this.formulaire.get('password'); }
  get passwordc() { return this.formulaire.get('passwordc'); }
  get pieceOfficielle() { return this.formulaire.get("pieceOfficielle") ;}
  get adresses() { return this.formulaire.controls.adresses as FormArray ;}
  get telephones() { return this.formulaire.get("telephones") as FormArray;}
  get emails() { return this.formulaire.get("emails") as FormArray;}
  get reseauSociaux() {return this.formulaire.controls.reseauSociaux as FormArray;}
  get personnesContacts() {return this.formulaire.controls.personnesContacts as FormArray;}
  get getFormPieceComplementaire() { return this.formulaire.controls.pieceComplementaires as FormArray; }


  constructor(
    public fb: FormBuilder,
    public sintaxApiService:IFUApiService,
    public civiliteService : CiviliteService,
    private router: Router,
    public confirmService:AppConfirmService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public pieceOfficielleService: PieceOfficielleService,
    public statusJuridiqueService: StatusJuridiqueService,
    private mediaObserver: MediaObserver,
    public contactContribuableService: ContactContribuableService,
    private _adapter: DateAdapter<any>,
    public localiteService : LocaliteService,
    public situationMatrimonialeService:SituationMatrimonialeService,
    public nationaliteService:NationaliteService,
    public contribuablePhysiqueService:ContribuablePhysiqueService,
    public professionService:ProfessionService,
    public typePieceIdentiteService : CategoriePieceService,
  ) {

    this.contribuable=this.route.snapshot.data["contribuablePhysique"];

    this.formulaire = this.fb.group({
        guid:[null],
        active: [false],
        resetOtp: [false],
       codeUnique: [null],
        username: [null,
          null,
          [AttributsExist.validateUsernameExistFn(this.contactContribuableService)]],
        password: [null, Validators.compose([])],
        passwordc: [null, Validators.compose([])],
        nationalite: [null],
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
        prenoms: [null, [Validators.required,Validators.maxLength(150),Validators.minLength(2)]],
        nom: [null, [Validators.required,Validators.maxLength(150),Validators.minLength(2)]],
        nomDeJeuneFille: [null],
        genre: [null, Validators.compose([Validators.required])],
        civilite: [null],
        dateNaissance: [null, Validators.compose([Validators.required])],
        lieuNaissance: [null],
        profession: [null],
        situationMatrimoniale: [null],
        nomPere: [null],
        prenomsPere: [null],
        nomMere: [null],
        prenomsMere: [null],
        emails: new FormArray([]),
        telephones: new FormArray([]),
        adresses: new FormArray([]),
        personnesContacts: new FormArray([]),
        pieceComplementaires: new FormArray([]),
        reseauSociaux: new FormArray([]),
    },
    {
      validator: MustMatch('password', 'passwordc')
    });

  }


  public formErrors: Array<string>;

  ngOnInit(): void {

    this.formulaire.valueChanges.pipe(
      takeUntil(this._onDestroy)
    ).subscribe(() => {
      this.formErrors = getErrors(this.formulaire);
    });

   this._adapter.setLocale("fr");


    let currentDate = new Date();
    this.maxDateNaissance = new Date(currentDate.getFullYear() - 10, currentDate.getMonth(), currentDate.getDay());
    this.minDateNaissance = new Date(currentDate.getFullYear() - 70, currentDate.getMonth(), currentDate.getDay());
    this.civilityRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.civiliteService);
    this.localiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.localiteService);
    this.nationnaliteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.nationaliteService);
    this.professionRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.professionService);
    this.nationaliteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.nationaliteService);
    this.statusJuridiqueAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.statusJuridiqueService);
    this.situationMatrimonialeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.situationMatrimonialeService);
    if (this.contribuable) {

      if(this.contribuable?.civilite) {
        this.civilityRemoteAutocomplete.listRessource$=of([this.contribuable.civilite]);
        this.civilityRemoteAutocomplete.initialList=[this.contribuable.civilite];
      }
      if(this.contribuable?.nationalite) {
        this.nationnaliteRemoteAutocomplete.listRessource$=of([this.contribuable.nationalite]);
        this.nationnaliteRemoteAutocomplete.initialList=[this.contribuable.nationalite];
      }
      if(this.contribuable?.profession) {
        this.professionRemoteAutocomplete.listRessource$=of([this.contribuable.profession]);
        this.professionRemoteAutocomplete.initialList=[this.contribuable.profession];
      }
      if(this.contribuable?.situationMatrimoniale) {
        this.situationMatrimonialeRemoteAutocomplete.listRessource$=of([this.contribuable.situationMatrimoniale]);
        this.situationMatrimonialeRemoteAutocomplete.initialList=[this.contribuable.situationMatrimoniale];
      }

      if (this.contribuable?.pieceComplementaires) {
        this.contribuable.pieceComplementaires.map((piece) => {
          this.getFormPieceComplementaire.insert(0, this.createPieceOfficielle(piece));
      });
      }
      if (this.contribuable.telephones) {
        this.contribuable.telephones.map((telephone) => {
          this.telephones.insert(0, this.createTelephone(telephone));
      });
      }

      if (this.contribuable.emails) {
        this.contribuable.emails.map((mail) => {
          this.emails.insert(0, this.createEmail(mail));
      });
      }
      if (this.contribuable.adresses) {
        this.contribuable.adresses.map((adresse) => {
          this.adresses.insert(0, this.createAdresse(adresse));
      });
      }

      if (this.contribuable.reseauSociaux) {
        this.contribuable.reseauSociaux.map((reseau) => {
          this.reseauSociaux.insert(0, this.createReseauSocial(reseau));
      });
      }

      if (this.contribuable.personnesContacts) {
        this.contribuable.personnesContacts.map((personneContact) => {
          this.personnesContacts.insert(0, this.createPersonnesContacts(personneContact));
      });
      }
      this.formulaire.patchValue({
        pieceOfficielle: {
          codeDownload: this.contribuable.pieceOfficielle?.documentPiece,
        }
       });
      this.formulaire.patchValue({
        guid: this.contribuable.guid,
        active: this.contribuable.active,
        username: this.contribuable.username,
        codeUnique: this.contribuable.codeUnique,
        nationalite:this.contribuable.nationalite ? this.contribuable.nationalite.id: null,
        civilite:this.contribuable.civilite ? this.contribuable.civilite.id :null,
        situationMatrimoniale:this.contribuable.situationMatrimoniale ? this.contribuable.situationMatrimoniale.id: null,
        pieceOfficielle: this.contribuable.pieceOfficielle || {},
        prenoms: this.contribuable.prenoms,
        nom: this.contribuable.nom,
        nomDeJeuneFille: this.contribuable.nomDeJeuneFille,
        profession:this.contribuable.profession ? this.contribuable.profession.id :null,
        genre: this.contribuable.genre,
        lieuNaissance: this.contribuable.lieuNaissance,
        dateNaissance:this.contribuable.dateNaissance,
        prenomsPere: this.contribuable.prenomsPere,
        nomPere: this.contribuable.nomPere,
        nomMere: this.contribuable.nomMere,
        prenomsMere:this.contribuable.prenomsMere,
      });

    } else {
      this.contribuable = new ContribuablePhysiqueElement();
    }
  }

  resetForm(){

      this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_PHYSIQUE}`]);

  }

  public getUrlRedirect() {
    return environment.FRONTEND_ROUTES.CONTRIBUABLE_PHYSIQUE+"/edition";
  }


  trouveContribuable(rechercheContribuableIFU: RechercheContribuableIFU){
    if(!rechercheContribuableIFU.success){
      SycadUtils.notifyRemoteError( {message: rechercheContribuableIFU.message}, this._snackBar);
    }else {
      this.openSnackBar("Un résultat a été trouvé","OK");
    }
  }

  trouveContribuableONI(rechercheContribuableONI: RechercheContribuableONI){
      if(!rechercheContribuableONI.success){
        SycadUtils.notifyRemoteError( {message: rechercheContribuableONI.message}, this._snackBar);
      }else {
        this.openSnackBar("Un résultat a été trouvé","OK");
      }
    }

  onSubmit() {


//// console.log("this.formulaire.value",this.formulaire.value)

    if (!this.formulaire.valid) {
      return false;
    } else {
      if (this.formulaire.value) {
        this.isLoadingResults=true;
        if (this.formulaire.value.guid) {

          this.contribuablePhysiqueService.update(this.formulaire.value).subscribe(data => {
            this.isLoadingResults=false;
            this.openSnackBar("Contribuable physique modifiée avec succès","OK");
            this.router.navigate([environment.FRONTEND_ROUTES.CONTRIBUABLE_PHYSIQUE]);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );

        } else {
          this.contribuablePhysiqueService.add(this.formulaire.value).subscribe(data => {
            this.isLoadingResults=false;
            this.openSnackBar("Contribuable physique ajoutée avec succès","OK");
            this.router.navigate([environment.FRONTEND_ROUTES.CONTRIBUABLE_PHYSIQUE]);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        }
      }
    }


    }







  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }

  /**************** piece officielle *********************/

  createPieceOfficielle(piece:PieceOfficielle) {
    if(piece) {
      return this.fb.group({
        id: [piece.id],
        categorie: [piece.categorie, Validators.compose([Validators.required])],
        dateExpiration: [piece.dateExpiration],
        dateObtention: [piece.dateObtention, Validators.compose([Validators.required])],
        numero: [piece.numero,
          Validators.compose([Validators.required, Validators.maxLength(150), Validators.minLength(2)]),
        [AttributsExist.validateNumeroPieceExistFn(this.contactContribuableService)]],
        nip: [piece.nip],
        autoriteDeDelivrance: [piece.autoriteDeDelivrance],
        lieuDeDelivrance: [piece.lieuDeDelivrance],
        codeDownload: [piece.documentPiece],
      });
    }else {
      return this.fb.group({
        id: [null],
        categorie: [null, Validators.compose([Validators.required])],
        dateExpiration: [null],
        dateObtention: [null, Validators.compose([Validators.required])],
        numero: [null,
          Validators.compose([Validators.required, Validators.maxLength(150), Validators.minLength(2)]),
        [AttributsExist.validateNumeroPieceExistFn(this.contactContribuableService)]],
        nip: [null],
        autoriteDeDelivrance: [null],
        lieuDeDelivrance: [null],
        codeDownload: null,
      });
    }
  }
  addNewPieceIdentiteInfo() {
    this.getFormPieceComplementaire.insert(0, this.createPieceOfficielle(null));

   }

   removePieceIdentite(index) {
    let pieceOfficielle = this.getFormPieceComplementaire.at(index);
    if (pieceOfficielle.value.id) {
      this.confirmService.confirm({
        title:"Confirmation",
        message:`Voulez-vous supprimer cette pièce complémentaire ? `
      }).subscribe(($choix)=> {

        if($choix) {
          this.isLoadingResults=true;
          this.pieceOfficielleService.delete(this.contribuable.guid,pieceOfficielle.value.id).subscribe(
            (result) => {
              this.isLoadingResults=false;
              this.openSnackBar("Element supprimé avec succès", "OK");
              this.getFormPieceComplementaire.removeAt(index);
            },
            (errorResponseMembre) => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponseMembre.error, this._snackBar);
            }
          );
        }

      });
    } else {
      this.getFormPieceComplementaire.removeAt(index);
    }
  }
  /**************** fin piece officielle *********************/

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
          this.contactContribuableService.deleteTelephone(this.contribuable.guid,telephone.value.id).subscribe(
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
public onChangeTelephonePrincipal(telephone) {
  this.telephones.controls.forEach(telCtl => {
    if(telCtl!==telephone) {
      telCtl.patchValue({
        principal: false
      });
    }
  });
}
  /**************** fin téléphone *********************/



  /**************** email *********************/
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

  addNewEmail() {
    this.emails.insert(0, this.createEmail(null));
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
          this.contactContribuableService.deleteEmail(this.contribuable.guid,email.value.id).subscribe(
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

  /**************** fin email *********************/


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
          this.contactContribuableService.deleteAdresse(this.contribuable.guid,adresse.value.id).subscribe(
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

  /**************** fin adresse *********************/


  /**************** reseau sociaux *********************/
  createReseauSocial(resaux:ReseauSociaux) {
    if(resaux) {
      return this.fb.group({
        id: [resaux.id],
        profil: [resaux.profil],
        type: [resaux.type]
      });
    }else {
      return this.fb.group({
        id: [null],
        profil: [null],
        type: [null]
      });
    }
  }
  addNewReseauSocial(){
    this.reseauSociaux.insert(0, this.createReseauSocial(null));
  }
  removeReseauSocial(index) {
    let reseauSociau = this.reseauSociaux.at(index);
    if (reseauSociau.value.id) {
      this.confirmService.confirm({
        title:"Confirmation",
        message:`Voulez-vous supprimer ce réseau social ? `
      }).subscribe(($choix)=> {

        if($choix) {
          this.isLoadingResults=true;
          this.contactContribuableService.deleteReseauSocial(this.contribuable.guid,reseauSociau.value.id).subscribe(
            (result) => {
              this.isLoadingResults=false;
              this.openSnackBar("Element supprimé avec succès", "OK");
              this.reseauSociaux.removeAt(index);
            },
            (errorResponseMembre) => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponseMembre.error, this._snackBar);
            }
          );
        }
      });
    } else {
      this.reseauSociaux.removeAt(index);
    }
  }
  /**************** fin reseau sociaux *********************/


  /**************** personne contact *********************/
  //
  createPersonnesContacts(personneContact:PersonneAContacter) {
    if(personneContact) {
      return this.fb.group({
        id: [personneContact.id],
        prenom: [personneContact.prenom,Validators.compose([Validators.required])],
        nom: [personneContact.nom, Validators.compose([Validators.required])],
        profession: [personneContact.profession],
        telephone: [personneContact.telephone, Validators.compose([Validators.required,GlobalPattern.patternTelephoneBf])],
        email: [personneContact.email, Validators.compose([Validators.required,Validators.email])],
        civilite: [personneContact.civilite],
        adresse: this.createAdresse(personneContact.adresse),
        genre: [personneContact.genre, Validators.compose([Validators.required])],

      });
    }else {


      return this.fb.group({
        id: [null],
        prenom: [null,Validators.compose([Validators.required])],
        nom: [null, Validators.compose([Validators.required])],
        telephone: [null, Validators.compose([Validators.required,GlobalPattern.patternTelephoneBf])],
        email: [null, Validators.compose([Validators.required,Validators.email])],
        civilite: [null],
        profession: [null],
        adresse: this.createAdresse(null),
        genre: [null, Validators.compose([Validators.required])],

      });
    }
  }
  addNewPersonnesContactsInfo(){
    this.personnesContacts.insert(0, this.createPersonnesContacts(null));
  }
  removePersonnesContact(index) {
    let personneContact = this.personnesContacts.at(index);
    if (personneContact.value.id) {
      this.confirmService.confirm({
        title:"Confirmation",
        message:`Voulez-vous supprimer cette personne contact ? `
      }).subscribe(($choix)=> {

        if($choix) {
          this.isLoadingResults=true;
          this.contactContribuableService.deletePersonneAContacter(this.contribuable.guid,personneContact.value.id).subscribe(
            (result) => {
              this.isLoadingResults=false;
              this.openSnackBar("Element supprimé avec succès", "OK");
              this.personnesContacts.removeAt(index);
            },
            (errorResponseMembre) => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponseMembre.error, this._snackBar);
            }
          );
        }
      });
    } else {
      this.personnesContacts.removeAt(index);
    }
  }
  /**************** fin personne contact *********************/
  public onSearchNationnalite(eventNgSelect) {
    this.nationnaliteRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchSituationMatrimonial(eventNgSelect) {
    this.situationMatrimonialeRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchProfession(eventNgSelect) {
    this.professionRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchCivilite(eventNgSelect) {
    this.civilityRemoteAutocomplete.term.next(eventNgSelect.term);
  }

}
