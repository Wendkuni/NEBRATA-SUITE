import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {ActeurElement} from '@sycadApp/models/data-references/contribuables/acteur.model';
import {of, Subject} from 'rxjs';
import {RemoteAutocomplete} from '@sycadApp/shared/form-components/model/remote-autocomplete';
import {
  Civilite,
  Contact,
  ReseauSociaux,
  StatusJuridiqueAutocomplete
} from '@sycadApp/models/data-references/system/model';
import {
  AdresseContribuable,
  CategorieActeur, ContactEntreprise,
  Nationalite, PieceOfficielle,
  RegimeFiscal,
  SecteurActivitePrincipale
} from '@sycadApp/models/data-references/contribuables/global.model';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {ActivatedRoute, Router} from '@angular/router';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {MatSnackBar} from '@angular/material/snack-bar';

import { CategorieActeurService } from '@sycadApp/services/data-references/system/categorie-acteur.service';
import { NationaliteService } from '@sycadApp/services/data-references/system/nationalite.service';
import { RegimeFiscalService } from '@sycadApp/services/impot/regime-fiscal.service';

import { SecteurActiviteService } from '@sycadApp/services/data-references/system/secteur-activite.service';
import {AttributsExist} from '@sycadShared/validators/remote/attributs-exist';
import { ContactContribuableService } from '@sycadApp/services/data-references/system/contact.service';

import { StatusJuridiqueService } from '@sycadApp/services/data-references/system/status-juridique.service';

import {SycadUtils} from '@sycadShared/utils.functions';
import {AdresseMinimumExist, GlobalPattern, getErrors} from '@sycadShared/validators/global-pattern';
import {DateAdapter} from '@angular/material/core';
import { PieceOfficielleService } from '@sycadApp/services/data-references/system/piece-officielle.service';

import { takeUntil } from 'rxjs/operators';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { environment } from 'environments/environment';
import { RechercheContribuableIFU } from '@sycadApp/shared/form-components/data-references-domaine/recherche-ifu/recherche-ifu.component';
import {
  CiviliteService
} from "@sycadApp/services/data-references/system/civilite-service.service";

@Component({
  selector: 'app-acteur-form-page',
  templateUrl: './acteur-form-page.component.html',
  styleUrls: ['./acteur-form-page.component.scss']
})
export class ActeurFormPageComponent implements OnInit {
public formulaireActeur: FormGroup;
public acteur: ActeurElement;
  public isLoadingResults = false;
  private _onDestroy = new Subject<void>();
  public passwordHide: boolean = true;
  public civilityRemoteAutocomplete = new RemoteAutocomplete<Civilite>();
  public statusJuridiqueRemoteAutocomplete = new RemoteAutocomplete<StatusJuridiqueAutocomplete>();
  public nationaliteRemoteAutocomplete = new RemoteAutocomplete<Nationalite>();
  public regimeFiscalRemoteAutocomplete = new RemoteAutocomplete<RegimeFiscal>();
  public secteurActivitePrincipalRemoteAutocomplete = new RemoteAutocomplete<SecteurActivitePrincipale>();
  public secteurActiviteSecondaireRemoteAutocomplete = new RemoteAutocomplete<SecteurActivitePrincipale>();
  public categorieActeurRemoteAutocomplete = new RemoteAutocomplete<CategorieActeur>();
  public activeMediaQuery = '';

  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
      //console.log("this.activeMediaQuery", this.activeMediaQuery)
    });
  }
  get denomination() {
    return this.formulaireActeur.get("denomination");
  }

  get dateDeCreation() {
    return this.formulaireActeur.get("dateDeCreation");
  }

  get sigle() {
    return this.formulaireActeur.get("sigle");
  }



  get nationalite() {
    return this.formulaireActeur.get("nationalite");
  }

  get capitalFiscal() {
    return this.formulaireActeur.get("capitalFiscal");
  }
  get regimeFiscal() {
    return this.formulaireActeur.get("regimeFiscal");
  }

  get chiffreAffaire() {
    return this.formulaireActeur.get("chiffreAffaire");
  }

  get statusJuridique() {
    return this.formulaireActeur.get('statusJuridique');
  }

  get activitePrincipale() {
    return this.formulaireActeur.get("activitePrincipale");
  }

  get numCNSS() {
    return this.formulaireActeur.get("numCNSS");
  }

  get activiteSecondaires() {
    return this.formulaireActeur.get('activiteSecondaires');
  }

  get pieceOfficielle() {
    return this.formulaireActeur.get("pieceOfficielle");
  }

  get contactEntreprises() {return this.formulaireActeur.controls.contactEntreprises as FormArray;}
  get active() {
    return this.formulaireActeur.get('active');
  }

  get guid() {
    return this.formulaireActeur.get('guid');
  }
  get username(){
    return this.formulaireActeur.get("username");
  }

get categorie(){return this.formulaireActeur.get("categorie");}
  get password(){
    return this.formulaireActeur.get("password");
  }
  get passwordc() {
    return this.formulaireActeur.get('passwordc');
  }
  get nom() {
    return this.formulaireActeur.get('nom');
  }
  get prenoms() {
    return this.formulaireActeur.get('prenoms');
  }
  get matricule() {
    return this.formulaireActeur.get('matricule');
  }

  get telephones() {
    return this.formulaireActeur.get("telephones") as FormArray;
  }

  get emails() {
    return this.formulaireActeur.get("emails") as FormArray;
  }

  get getFormPieceComplementaire() {
    return this.formulaireActeur.controls.pieceComplementaires as FormArray;
  }

  get adresses() {
    return this.formulaireActeur.controls.adresses as FormArray;
  }

  get reseauSociaux() {
    return this.formulaireActeur.controls.reseauSociaux as FormArray;
  }

  get profiles() {
    return this.formulaireActeur.get("utilisateur").get('profiles');
  }
  constructor(private router: Router,
              private route: ActivatedRoute,
              private mediaObserver: MediaObserver,
              public confirmService: AppConfirmService,
              private _snackBar: MatSnackBar,
              private _adapter: DateAdapter<any>,
              public fb: FormBuilder,
              public civiliteService : CiviliteService,
              public acteursService: ActeursService,
              public categorieActeurService: CategorieActeurService,
              public nationaliteService: NationaliteService,
              public regimeFiscalService: RegimeFiscalService,
              public secteurActiviteService: SecteurActiviteService,
              public contactContribuableService: ContactContribuableService,
              public statusJuridiqueService: StatusJuridiqueService,
              public pieceOfficielleService: PieceOfficielleService,
              )
  {
    this.acteur = this.route.snapshot.data["acteur"];
    this.formulaireActeur = this.fb.group({
      categorie: [null, Validators.compose([Validators.required])],
      guid: [null],
      username: [null,
        null,
        [AttributsExist.validateUsernameExistFn(this.contactContribuableService)]],
      active: [false],
      resetOtp: [false],
      password: [null],
      passwordc: [null],
      dateDeCreation: [null],
      matricule: [null],
      prenoms: [null],
      nom: [null],
      civilite: [null],
      denomination: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
      sigle: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
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

    this.formulaireActeur.valueChanges.pipe(
      takeUntil(this._onDestroy)
    ).subscribe(() => {
      this.formErrors = getErrors(this.formulaireActeur);

    });


    this._adapter.setLocale("fr");
    this.civilityRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.civiliteService);
    this.categorieActeurRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.categorieActeurService);
    this.statusJuridiqueRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.statusJuridiqueService);
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

    if(this.acteur){
      if (this.acteur?.categorie) {
        this.categorieActeurRemoteAutocomplete.listRessource$ = of([this.acteur.categorie]);
        this.categorieActeurRemoteAutocomplete.initialList = [this.acteur.categorie];
      }
      if(this.acteur?.civilite) {
        this.civilityRemoteAutocomplete.listRessource$=of([this.acteur.civilite]);
        this.civilityRemoteAutocomplete.initialList=[this.acteur.civilite];
      }
      if (this.acteur?.statusJuridique) {
        this.statusJuridiqueRemoteAutocomplete.listRessource$ = of([this.acteur.statusJuridique]);
        this.statusJuridiqueRemoteAutocomplete.initialList = [this.acteur.statusJuridique];
      }
      if(this.acteur?.nationalite){
        this.nationaliteRemoteAutocomplete.listRessource$=of([this.acteur.nationalite]);
        this.nationaliteRemoteAutocomplete.initialList = [this.acteur.nationalite];
      }

      if(this.acteur?.regimeFiscal){
        this.regimeFiscalRemoteAutocomplete.listRessource$=of([this.acteur.regimeFiscal]);
        this.regimeFiscalRemoteAutocomplete.initialList = [this.acteur.regimeFiscal];
      }
      if(this.acteur?.activitePrincipale){
        this.secteurActivitePrincipalRemoteAutocomplete.listRessource$ = of([this.acteur.activitePrincipale]);
        this.secteurActivitePrincipalRemoteAutocomplete.initialList= [this.acteur.activitePrincipale];
      }

      if(this.acteur?.activiteSecondaires){
        this.secteurActiviteSecondaireRemoteAutocomplete.listRessource$ = of(this.acteur.activiteSecondaires);
        this.secteurActiviteSecondaireRemoteAutocomplete.initialList= this.acteur.activiteSecondaires;
      }
      if (this.acteur.pieceComplementaires) {
        this.acteur.pieceComplementaires.map((piece) => {
          this.getFormPieceComplementaire.insert(0, this.createPieceOfficielle(piece));
        });
      }
      if (this.acteur.telephones) {
        this.acteur?.telephones?.map((telephone) => {
          this.telephones.insert(0, this.createTelephone(telephone));
        });
      }

      if (this.acteur.emails) {
        this.acteur?.emails?.map((mail) => {
          this.emails.insert(0, this.createEmail(mail));
        });
      }
      if (this.acteur.adresses) {
        this.acteur.adresses.map((adresse) => {
          this.adresses.insert(0, this.createAdresse(adresse));
        });
      }

      if (this.acteur.reseauSociaux) {
        this.acteur.reseauSociaux.map((reseau) => {
          this.reseauSociaux.insert(0, this.createReseauSocial(reseau));
        });
      }
      if(this.acteur.contactEntreprises){
        this.acteur.contactEntreprises.map((contact) => {
          this.contactEntreprises.insert(0, this.createContactEntreprise(contact));
        });
      }

      this.formulaireActeur.patchValue({
        pieceOfficielle: {
          codeDownload: this.acteur.pieceOfficielle?.documentPiece,
        }
       });
      this.formulaireActeur.patchValue({
        active: this.acteur.active,
        prenoms: this.acteur.prenoms,
        nom: this.acteur.nom,
        matricule:this.acteur.matricule,
        guid: this.acteur.guid,
        civilite:this.acteur.civilite?.id,
        categorie: this.acteur.categorie ? this.acteur.categorie.id: null,
        username: this.acteur.username,
        dateDeCreation: this.acteur.dateDeCreation,
        denomination: this.acteur.denomination,
        sigle: this.acteur.sigle,
        nationalite: this.acteur.nationalite ? this.acteur.nationalite.id : null,
        activitePrincipale: this.acteur.activitePrincipale ? this.acteur.activitePrincipale.id : null,
        activiteSecondaires: this.acteur.activiteSecondaires.map(activiteSecondaires => activiteSecondaires.id),
        regimeFiscal: this.acteur.regimeFiscal ? this.acteur.regimeFiscal.id : null,
        capitalFiscal: this.acteur.capitalFiscal,
        chiffreAffaire: this.acteur.chiffreAffaire,
        numCNSS: this.acteur.numCNSS,
        statusJuridique: this.acteur.statusJuridique ? this.acteur.statusJuridique.id : null,
        pieceOfficielle: this.acteur.pieceOfficielle?this.acteur.pieceOfficielle:{}
      });

    }else {
      this.acteur = new ActeurElement();
    }
  }

  resetForm(){

      this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_ACTEUR}`]);

  }

  trouveContribuable(rechercheContribuableIFU: RechercheContribuableIFU){
    if(!rechercheContribuableIFU.success){
      SycadUtils.notifyRemoteError( {message: rechercheContribuableIFU.message}, this._snackBar);
    }else {
      this.openSnackBar("Un résultat a été trouvé","OK");
    }
  }

  onSubmit() {



    if (!this.formulaireActeur.valid) {
      return false;
    } else {
      if (this.formulaireActeur.value) {
        this.isLoadingResults=true;
        if (this.formulaireActeur.value.guid) {

          this.acteursService.update(this.formulaireActeur.value).subscribe(data => {
              this.isLoadingResults=false;
              this.openSnackBar("Acteur modifié avec succès","OK");
              this.router.navigate([environment.FRONTEND_ROUTES.CONTRIBUABLE_ACTEUR]);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );

        } else {
          this.acteursService.add(this.formulaireActeur.value).subscribe(data => {
              this.isLoadingResults=false;
              this.openSnackBar("Acteur ajouté avec succès","OK");
              this.router.navigate([environment.FRONTEND_ROUTES.CONTRIBUABLE_ACTEUR]);
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
  public onSearchCivilite(eventNgSelect) {
    this.civilityRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchSecteurActiviteSecondaire(eventNgSelect) {
    this.secteurActiviteSecondaireRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchCategorieActeur(eventNgSelect){
    this.categorieActeurRemoteAutocomplete.term.next(eventNgSelect.term);
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
          this.pieceOfficielleService.delete(this.acteur.guid,pieceOfficielle.value.id).subscribe(
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
          this.contactContribuableService.deleteTelephone(this.acteur.guid,telephone.value.id).subscribe(
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
          this.contactContribuableService.deleteContactEntreprise(this.acteur.guid,contactEntreprise.value.id).subscribe(
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
          this.contactContribuableService.deleteEmail(this.acteur.guid,email.value.id).subscribe(
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
          this.contactContribuableService.deleteAdresse(this.acteur.guid,adresse.value.id).subscribe(
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
          this.contactContribuableService.deleteReseauSocial(this.acteur.guid,reseauSociau.value.id).subscribe(
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


  public getUrlRedirect() {
    return environment.FRONTEND_ROUTES.CONTRIBUABLE_ACTEUR+"/edition";
  }

}
