import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  AdresseContribuable,
  Nationalite, PieceOfficielle, RegimeFiscal, SecteurActivitePrincipale, ContactEntreprise
} from '@sycadApp/models/data-references/contribuables/global.model';
import {of, Subject} from 'rxjs';
import {RemoteAutocomplete} from '@sycadApp/shared/form-components/model/remote-autocomplete';
import {
  Civilite,
  Contact,
  ReseauSociaux,
  StatusJuridiqueAutocomplete
} from '@sycadApp/models/data-references/system/model';
import {LocaliteAutocomplete} from '@sycadApp/models/data-references/territoire/localite.model';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {ActivatedRoute, Router} from '@angular/router';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DateAdapter} from '@angular/material/core';
import {CiviliteService} from '@sycadApp/services/data-references/system/civilite-service.service';
import { StatusJuridiqueService } from '@sycadApp/services/data-references/system/status-juridique.service';
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';
import { NationaliteService } from '@sycadApp/services/data-references/system/nationalite.service';
import { RegimeFiscalService } from '@sycadApp/services/impot/regime-fiscal.service';

import { SecteurActiviteService } from '@sycadApp/services/data-references/system/secteur-activite.service';
import { PieceOfficielleService } from '@sycadApp/services/data-references/system/piece-officielle.service';

import { ContactContribuableService } from '@sycadApp/services/data-references/system/contact.service';

import {ContribuableMoraleElement} from '@sycadApp/models/data-references/contribuables/contribuable-moral.model';

import {SycadUtils} from '@sycadShared/utils.functions';
import {ContribuableMoralService} from '@sycadApp/services/data-references/contribuables/contribuable-moral-service';
import {AdresseMinimumExist, GlobalPattern, getErrors} from '@sycadShared/validators/global-pattern';
import {AttributsExist} from '@sycadShared/validators/remote/attributs-exist';
import { takeUntil } from 'rxjs/operators';
import {CategoriePiece} from '@sycadApp/models/data-references/contribuables/global.model';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { environment } from 'environments/environment';
import { IFUApiService } from '@sycadApp/shared/form-components/data-references-domaine/recherche-ifu/api-ifu.service';
import { RechercheContribuableIFU } from '@sycadApp/shared/form-components/data-references-domaine/recherche-ifu/recherche-ifu.component';

@Component({
  selector: 'app-contribuable-moral-form-page',
  templateUrl: './contribuable-moral-form-page.component.html',
  styleUrls: ['./contribuable-moral-form-page.component.scss']
})
export class ContribuableMoralFormPageComponent implements OnInit {
  public formulaireContribuable: FormGroup;
  public contribuable: ContribuableMoraleElement;
  public isLoadingResults = false;
  private _onDestroy = new Subject<void>();
  public passwordHide: boolean = true;
  public statusJuridiqueRemoteAutocomplete = new RemoteAutocomplete<StatusJuridiqueAutocomplete>();
  public typePieceIdentiteRemoteAutocomplete = new RemoteAutocomplete<CategoriePiece>();
  public localiteRemoteAutocomplete = new RemoteAutocomplete<LocaliteAutocomplete>();
  public civilityRemoteAutocomplete = new RemoteAutocomplete<Civilite>();
  public nationaliteRemoteAutocomplete = new RemoteAutocomplete<Nationalite>();
  public regimeFiscalRemoteAutocomplete = new RemoteAutocomplete<RegimeFiscal>();
  public secteurActivitePrincipalRemoteAutocomplete = new RemoteAutocomplete<SecteurActivitePrincipale>();
  public secteurActiviteSecondaireRemoteAutocomplete = new RemoteAutocomplete<SecteurActivitePrincipale>();



  public activeMediaQuery = '';

  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
     //// console.log("this.activeMediaQuery", this.activeMediaQuery)
    });
  }

  get denomination() {
    return this.formulaireContribuable.get("denomination");
  }

  get dateDeCreation() {
    return this.formulaireContribuable.get("dateDeCreation");
  }

  get sigle() {
    return this.formulaireContribuable.get("sigle");
  }

  get codeUnique() {
    return this.formulaireContribuable.get('codeUnique');
  }

  get nationalite() {
    return this.formulaireContribuable.get("nationalite");
  }

  get capitalFiscal() {
    return this.formulaireContribuable.get("capitalFiscal");
  }
  get regimeFiscal() {
    return this.formulaireContribuable.get("regimeFiscal");
  }

  get chiffreAffaire() {
    return this.formulaireContribuable.get("chiffreAffaire");
  }

  get statusJuridique() {
    return this.formulaireContribuable.get('statusJuridique');
  }

  get activitePrincipale() {
    return this.formulaireContribuable.get("activitePrincipale");
  }

  get numCNSS() {
    return this.formulaireContribuable.get("numCNSS");
  }

  get activiteSecondaires() {
    return this.formulaireContribuable.get('activiteSecondaires');
  }

  get pieceOfficielle() {
    return this.formulaireContribuable.get("pieceOfficielle");
  }

  get contactEntreprises() {return this.formulaireContribuable.controls.contactEntreprises as FormArray;}
  get active() {
    return this.formulaireContribuable.get('active');
  }

  get guid() {
    return this.formulaireContribuable.get('guid');
  }
  get username(){
    return this.formulaireContribuable.get("username");
  }


  get password(){
    return this.formulaireContribuable.get("password");
}
get passwordc() {
    return this.formulaireContribuable.get('passwordc');
  }
  get getFormContactEntreprises() {
    return this.formulaireContribuable.controls.contactEntreprises as FormArray;
  }

  get getFormEmails() {
    return this.formulaireContribuable.controls.contacts.get("emails") as FormArray;
  }

  get telephones() {
    return this.formulaireContribuable.get("telephones") as FormArray;
  }

  get emails() {
    return this.formulaireContribuable.get("emails") as FormArray;
  }

  get getFormPieceComplementaire() {
    return this.formulaireContribuable.controls.pieceComplementaires as FormArray;
  }

  get adresses() {
    return this.formulaireContribuable.controls.adresses as FormArray;
  }

  get reseauSociaux() {
    return this.formulaireContribuable.controls.reseauSociaux as FormArray;
  }

  get profiles() {
    return this.formulaireContribuable.get("utilisateur").get('profiles');
  }



  constructor(
    private router: Router,
    public sintaxApiService:IFUApiService,
    private route: ActivatedRoute,
    private mediaObserver: MediaObserver,
    public confirmService: AppConfirmService,
    private _snackBar: MatSnackBar,
    public fb: FormBuilder,
    public contribuableService : ContribuableMoralService,
    private _adapter: DateAdapter<any>,
    public civiliteService: CiviliteService,
    public statutJuridiqueService: StatusJuridiqueService,
    public typePieceIdentiteService: CategoriePieceService,
    public localiteService: LocaliteService,
    public nationaliteService: NationaliteService,
    public regimeFiscalService: RegimeFiscalService,
    public secteurActiviteService: SecteurActiviteService,
    public pieceOfficielleService: PieceOfficielleService,
    public contactContribuableService: ContactContribuableService,
    public cd : ChangeDetectorRef
  ) {
    this.contribuable = this.route.snapshot.data["contribuable"];
    this.formulaireContribuable = this.fb.group({
      guid: [null],
      username: [
        null,
        null,
        [AttributsExist.validateUsernameExistFn(this.contactContribuableService)]],
      active: [false],
      resetOtp: [false],
      password: [null],
      passwordc: [null],
      dateDeCreation: [null],
      denomination: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
      sigle: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
      codeUnique: [null],
      nationalite: [null],
      pieceOfficielle: this.fb.group({
        categorie: [null, Validators.compose([Validators.required])],
        dateExpiration: [null],
        dateObtention: [null, Validators.compose([Validators.required])],
        numero: [null,
          Validators.compose([Validators.required, Validators.maxLength(150), Validators.minLength(2)]),
        [AttributsExist.validateNumeroPieceExistFn(this.contactContribuableService,true)]],
        nip: [null],
        autoriteDeDelivrance: [null],
        lieuDeDelivrance: [null],
        codeDownload: null,
      }),
      activitePrincipale: [null],
      activiteSecondaires: [null],
      regimeFiscal: [null],
      capitalFiscal: [null],
      chiffreAffaire: [null],
      numCNSS: [null,
        Validators.compose([]),
        [AttributsExist.validateNumeroCnssExistFn(this.contactContribuableService)]],
      statusJuridique: [null, Validators.compose([Validators.required])],
      emails: new FormArray([]),
      telephones: new FormArray([]),
      pieceComplementaires: new FormArray([]),
      adresses: new FormArray([]),
      reseauSociaux: new FormArray([]),
      contactEntreprises: new FormArray([])
    });

  }

  public formErrors: Array<string>;

  ngOnInit(): void {

    this.formulaireContribuable.valueChanges.pipe(
      takeUntil(this._onDestroy)
    ).subscribe(() => {
      this.formErrors = getErrors(this.formulaireContribuable);
    });


    this._adapter.setLocale("fr");
    this.civilityRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.civiliteService);
    this.statusJuridiqueRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.statutJuridiqueService);
    this.typePieceIdentiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.typePieceIdentiteService);
    this.localiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.localiteService);
    this.nationaliteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.nationaliteService);
    this.regimeFiscalRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.regimeFiscalService);
    this.secteurActivitePrincipalRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.secteurActiviteService);
    this.secteurActiviteSecondaireRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.secteurActiviteService);




   this.activitePrincipale.valueChanges.subscribe(x => {
    if(x) {
     if(this.activiteSecondaires.value){
      let filtered = this.activiteSecondaires.value.filter((value)=> {
        return value!==x;
      });
      this.activiteSecondaires.setValue(filtered);
      }
      this.secteurActiviteSecondaireRemoteAutocomplete.filtersId=[x];
      this.secteurActiviteSecondaireRemoteAutocomplete.term.next("");
    }
  });


    if (this.contribuable) {
      if (this.contribuable?.statusJuridique) {
        this.statusJuridiqueRemoteAutocomplete.listRessource$ = of([this.contribuable.statusJuridique]);
        this.statusJuridiqueRemoteAutocomplete.initialList = [this.contribuable.statusJuridique];
      }
      if (this.contribuable?.nationalite) {
        this.nationaliteRemoteAutocomplete.listRessource$ = of([this.contribuable.nationalite]);
        this.nationaliteRemoteAutocomplete.initialList = [this.contribuable.nationalite];
      }
      if(this.contribuable?.regimeFiscal){
        this.regimeFiscalRemoteAutocomplete.listRessource$ = of([this.contribuable.regimeFiscal]);
        this.regimeFiscalRemoteAutocomplete.initialList = [this.contribuable.regimeFiscal];
      }
      if(this.contribuable?.activitePrincipale){
        this.secteurActivitePrincipalRemoteAutocomplete.listRessource$ = of([this.contribuable.activitePrincipale]);
        this.secteurActivitePrincipalRemoteAutocomplete.initialList= [this.contribuable.activitePrincipale];
      }

      if(this.contribuable?.activiteSecondaires){
        this.secteurActiviteSecondaireRemoteAutocomplete.listRessource$ = of(this.contribuable.activiteSecondaires);
        this.secteurActiviteSecondaireRemoteAutocomplete.initialList= this.contribuable.activiteSecondaires;
      }
      if (this.contribuable.pieceComplementaires) {

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
        if(this.contribuable.contactEntreprises){
          this.contribuable.contactEntreprises.map((contact) => {
            this.contactEntreprises.insert(0, this.createContactEntreprise(contact));
          });
        }
      }

      this.formulaireContribuable.patchValue({
        pieceOfficielle: {
          codeDownload: this.contribuable.pieceOfficielle?.documentPiece,
        }
       });

      this.formulaireContribuable.patchValue({
        active: this.contribuable.active,
        guid: this.contribuable.guid,
        username: this.contribuable.username,
        dateDeCreation: this.contribuable.dateDeCreation,
        denomination: this.contribuable.denomination,
        codeUnique: this.contribuable.codeUnique,
        sigle: this.contribuable.sigle,
        nationalite: this.contribuable.nationalite ? this.contribuable.nationalite.id : null,
        activitePrincipale: this.contribuable.activitePrincipale ? this.contribuable.activitePrincipale.id : null,
        activiteSecondaires: this.contribuable.activiteSecondaires.map(activiteSecondaires => activiteSecondaires.id),
        regimeFiscal: this.contribuable.regimeFiscal ? this.contribuable.regimeFiscal.id : null,
        capitalFiscal: this.contribuable.capitalFiscal,
        chiffreAffaire: this.contribuable.chiffreAffaire,
        numCNSS: this.contribuable.numCNSS,
        statusJuridique: this.contribuable.statusJuridique ? this.contribuable.statusJuridique.id : null,
        pieceOfficielle: this.contribuable.pieceOfficielle
      });

    } else {
      this.contribuable = new ContribuableMoraleElement();

    }
  }

  resetForm(){
      this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_MORAL}`]);
  }

  public getUrlRedirect() {
    return environment.FRONTEND_ROUTES.CONTRIBUABLE_MORAL+"/edition";
  }

  trouveContribuable(rechercheContribuableIFU: RechercheContribuableIFU){
    if(!rechercheContribuableIFU.success){
      SycadUtils.notifyRemoteError( {message: rechercheContribuableIFU.message}, this._snackBar);
    }else {
      this.openSnackBar("Un résultat a été trouvé","OK");
    }
  }

  onSubmit() {



    if (!this.formulaireContribuable.valid) {
      return false;
    } else {
      if (this.formulaireContribuable.value) {
        this.isLoadingResults=true;
        if (this.formulaireContribuable.value.guid) {

          this.contribuableService.update(this.formulaireContribuable.value).subscribe(data => {
              this.isLoadingResults=false;
              this.openSnackBar("Contribuable moral modifié avec succès","OK");
              this.router.navigate([environment.FRONTEND_ROUTES.CONTRIBUABLE_MORAL]);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );

        } else {
          this.contribuableService.add(this.formulaireContribuable.value).subscribe(data => {
              this.isLoadingResults=false;
              this.openSnackBar("Contribuable moral ajouté avec succès","OK");
              this.router.navigate([environment.FRONTEND_ROUTES.CONTRIBUABLE_MORAL]);
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

  public onSearchNationalite(eventNgSelect) {
    this.nationaliteRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchRegimeFiscal(eventNgSelect) {
    this.regimeFiscalRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchStatusJuridique(eventNgSelect) {
    this.statusJuridiqueRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchSecteurActivitePrincipal(eventNgSelect) {
    this.secteurActivitePrincipalRemoteAutocomplete.term.next(eventNgSelect.term);

  }

  public onSearchSecteurActiviteSecondaire(eventNgSelect) {
    this.secteurActiviteSecondaireRemoteAutocomplete.term.next(eventNgSelect.term);
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


  /**************** personne contact *********************/
  //
  createContactEntreprise(contactEntreprise:ContactEntreprise) {
    if(contactEntreprise) {
      return this.fb.group({
        id: [contactEntreprise.id],
        prenom: [contactEntreprise.prenom,Validators.compose([Validators.required])],
        nom: [contactEntreprise.nom, Validators.compose([Validators.required])],
        telephone: [contactEntreprise.telephone, Validators.compose([Validators.required,GlobalPattern.patternTelephoneBf])],
        email: [contactEntreprise.email, Validators.compose([Validators.required,Validators.email])],
        civilite: [contactEntreprise.civilite],
        adresse: this.createAdresse(contactEntreprise.adresse),
        fonction: [contactEntreprise.fonction],
        genre: [contactEntreprise.genre, Validators.compose([Validators.required])],

      });
    }else {
      return this.fb.group({
        id: [null],
        prenom: [null,Validators.compose([Validators.required])],
        nom: [null, Validators.compose([Validators.required])],
        telephone: [null, Validators.compose([Validators.required,GlobalPattern.patternTelephoneBf])],
        email: [null, Validators.compose([Validators.required,Validators.email])],
        civilite: [null],
        adresse: this.createAdresse(null),
        fonction: [null],
        genre: [null, Validators.compose([Validators.required])],

      });
    }
  }
  addNewContactEntrepriseInfo(){
    this.contactEntreprises.insert(0, this.createContactEntreprise(null));
  }
  removeContactEntreprise(index) {
    let contactEntreprise = this.contactEntreprises.at(index);
    if (contactEntreprise.value.id) {
      this.confirmService.confirm({
        title:"Confirmation",
        message:`Voulez-vous supprimer cette personne contact ? `
      }).subscribe(($choix)=> {

        if($choix) {
          this.isLoadingResults=true;
          this.contactContribuableService.deleteContactEntreprise(this.contribuable.guid,contactEntreprise.value.id).subscribe(
            (result) => {
              this.isLoadingResults=false;
              this.openSnackBar("Element supprimé avec succès", "OK");
              this.contactEntreprises.removeAt(index);
            },
            (errorResponseMembre) => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponseMembre.error, this._snackBar);
            }
          );
        }
      });
    } else {
      this.contactEntreprises.removeAt(index);
    }
  }
  /**************** fin personne contact *********************/


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
  createAdresse(adresse: AdresseContribuable) {
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
        principal: [null],
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


}

