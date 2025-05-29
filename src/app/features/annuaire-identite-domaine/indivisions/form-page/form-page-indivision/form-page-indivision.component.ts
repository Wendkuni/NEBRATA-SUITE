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
import {IndivisionsService} from '@sycadApp/services/data-references/contribuables/indivisions.service';

import { IndivisionrelationService } from '@sycadApp/services/data-references/contribuables/indivisionRelation.service';
import { IndivisionRelationAutocomplete, IndivisionRelationElement, QualiteRelation } from "@sycadApp/models/data-references/system/indivision-relation.model";
import { DateAdapter } from "@angular/material/core";
import {Civilite, StatusJuridique, ReseauSociaux, Contact} from '@sycadApp/models/data-references/system/model';

import {GlobalPattern, AdresseMinimumExist, getErrors} from '@sycadShared/validators/global-pattern';
import { Nationalite, PieceOfficielle,AdresseContribuable} from '@sycadApp/models/data-references/contribuables/global.model';
import { StatusJuridiqueService } from '@sycadApp/services/data-references/system/status-juridique.service';
import {CiviliteService} from '@sycadApp/services/data-references/system/civilite-service.service';
import { NationaliteService } from '@sycadApp/services/data-references/system/nationalite.service';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { PieceOfficielleService } from '@sycadApp/services/data-references/system/piece-officielle.service';

import { ContactContribuableService } from '@sycadApp/services/data-references/system/contact.service';

import { takeUntil } from 'rxjs/operators';
import { AttributsExist } from '@sycadApp/shared/validators/remote/attributs-exist';
import { IndivisionElement, IndivisionMembreElement } from '@sycadApp/models/data-references/contribuables/indivisions.model';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';

@Component({
  selector: 'app-form-page-indivision',
  templateUrl: './form-page-indivision.component.html',
  styleUrls: ['./form-page-indivision.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormPageIndivisionComponent implements OnInit {
  public formulaire: FormGroup;
  public  indivision: IndivisionElement;

  public isLoadingResults = false;

  private _onDestroy = new Subject<void>();
  public relationRemoteAutocomplete = new RemoteAutocomplete<IndivisionRelationAutocomplete>();
  public contribuableRemoteAutocomplete = new RemoteAutocompleteIndivisionMemebrable();
  public statusJuridiqueAutocomplete = new RemoteAutocomplete<StatusJuridique>();
  public civilityRemoteAutocomplete = new RemoteAutocomplete<Civilite>();
  public nationaliteRemoteAutocomplete = new RemoteAutocomplete<Nationalite>();

   public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      //  this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
     //// console.log("this.activeMediaQuery",this.activeMediaQuery)
      //this.grid.cols = this.gridByBreakpoint[change.mqAlias];
    });
  }

  // end Gestion de la responsivité
  get relation() { return this.formulaire.get("relation");}
  get membres(): FormArray { return this.formulaire.get("membres") as FormArray; }
  get csrf() { return this.formulaire.get("csrf");}
  get dateDeCreation() { return this.formulaire.get("dateDeCreation"); }
  get nationalite() { return this.formulaire.get("nationalite") ;}
  get pieceOfficielle() { return this.formulaire.get("pieceOfficielle") ;}

  get denomination() {return this.formulaire.get('denomination');}
  get statusJuridique(){return this.formulaire.get("statusJuridique");}
  get getFormEmails() { return this.formulaire.controls.contacts.get("emails") as FormArray;  }
  get telephones() { return this.formulaire.get("telephones") as FormArray;}
  get emails() { return this.formulaire.get("emails") as FormArray;}
  get getFormPieceComplementaire() { return this.formulaire.controls.pieceComplementaires as FormArray; }
  get adresses() { return this.formulaire.controls.adresses as FormArray ;}
  get reseauSociaux() {return this.formulaire.controls.reseauSociaux as FormArray;}
  get active() { return this.formulaire.get('active'); }
  get guid() {return this.formulaire.get('guid');}
  get profiles() {return this.formulaire.get("utilisateur").get('profiles');}



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mediaObserver: MediaObserver,
    public confirmService:AppConfirmService,
    private _snackBar: MatSnackBar,
    public fb: FormBuilder,
    private _adapter: DateAdapter<any>,
    public indivisionsService: IndivisionsService,
    public relationService: IndivisionrelationService,
    public statusJuridiqueService: StatusJuridiqueService,
    public civiliteService: CiviliteService,
    public typePieceIdentiteService: CategoriePieceService,
    public nationaliteService: NationaliteService,
    public pieceOfficielleService: PieceOfficielleService,
    public contactContribuableService: ContactContribuableService,
  ) {

    this.indivision=this.route.snapshot.data["indivision"];

    this.formulaire = this.fb.group({
        dateDeCreation: [null, Validators.compose([Validators.required])],
        relation: [null, Validators.compose([Validators.required])],
        membres: this.fb.array([]),
        guid: [null],
        active: [false],
         pieceOfficielle: this.fb.group({
          categorie: [null, Validators.compose([Validators.required])],
          dateExpiration: [null, Validators.compose([Validators.required])],
          dateObtention: [null, Validators.compose([Validators.required])],
          numero: [null,
            Validators.compose([Validators.required,Validators.maxLength(150),Validators.minLength(2)]),
            [AttributsExist.validateNumeroPieceExistFn(this.contactContribuableService,true)]],
          nip: [null],
          autoriteDeDelivrance: [null, Validators.compose([Validators.required])],
          lieuDeDelivrance: [null, Validators.compose([Validators.required])],
          codeDownload: [null],
        }),
        denomination: [null, Validators.compose([Validators.required])],
        nationalite:[null, Validators.compose([Validators.required])],
        statusJuridique: [null, Validators.compose([Validators.required])],
        emails: new FormArray([]),
        telephones: new FormArray([]),
        pieceComplementaires: new FormArray([]),
        adresses: new FormArray([]),
        reseauSociaux: new FormArray([]),

    });
/*
,{
      validator: MustMatch('password', 'passwordc')
    }
*/
  }


  public formErrors: Array<string>;

  ngOnInit(): void {

    this.formulaire.valueChanges.pipe(
      takeUntil(this._onDestroy)
    ).subscribe(() => {
      this.formErrors = getErrors(this.formulaire);
    });


   this._adapter.setLocale("fr");

    this.relationRemoteAutocomplete.initializeRemoteAutocompletion(
      this._onDestroy,
      this.relationService
    );
    this.contribuableRemoteAutocomplete.initializeRemoteAutocompletion(
      this._onDestroy,
      this.indivisionsService
    );

    this.statusJuridiqueAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.statusJuridiqueService);
    this.civilityRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.civiliteService);

    this.nationaliteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.nationaliteService);

    if (this.indivision) {

     //// console.log("this.indivision",this.indivision);

      if(this.indivision?.relation) {
        this.relationRemoteAutocomplete.listRessource$=of([this.indivision.relation]);
        this.relationRemoteAutocomplete.initialList=[this.indivision.relation];
        this.currentRelation=this.indivision.relation;
      }

      if(this.indivision?.nationalite) {
        this.nationaliteRemoteAutocomplete.listRessource$=of([this.indivision.nationalite]);
        this.nationaliteRemoteAutocomplete.initialList=[this.indivision.nationalite];
      }
      if(this.indivision?.statusJuridique) {
        this.statusJuridiqueAutocomplete.listRessource$=of([this.indivision.statusJuridique]);
        this.statusJuridiqueAutocomplete.initialList=[this.indivision.statusJuridique];
      }

      if (this.indivision.membres) {

          this.indivision.membres.map((mem) => {
            this.membres.insert(0, this.createMembreForm(mem));
        });
        this.qualiteList$=this.currentRelation?.qualites;

        setTimeout(() => {
          this.onChangeQualite();
        } );
      }

      if (this.indivision.pieceComplementaires) {
        this.indivision.pieceComplementaires.map((piece) => {
          this.getFormPieceComplementaire.insert(0, this.createPieceOfficielle(piece));
      });
      }
      if (this.indivision.telephones) {
        this.indivision.telephones.map((telephone) => {
          this.telephones.insert(0, this.createTelephone(telephone));
      });
      }

      if (this.indivision.emails) {
        this.indivision.emails.map((mail) => {
          this.emails.insert(0, this.createEmail(mail));
      });
      }
      if (this.indivision.adresses) {
        this.indivision.adresses.map((adresse) => {
          this.adresses.insert(0, this.createAdresse(adresse));
      });
      }

      if (this.indivision.reseauSociaux) {
        this.indivision.reseauSociaux.map((reseau) => {
          this.reseauSociaux.insert(0, this.createReseauSocial(reseau));
      });
      }

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
      this.indivision = new IndivisionElement();
    }
  }


  public onSearchRelation(eventNgSelect) {
    this.relationRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchContribuable(eventNgSelect) {
    this.contribuableRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  resetForm(){
      this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_INDIVISION}`]);
  }
  onSubmit() {



    if (!this.formulaire.valid) {
      return false;
    } else {
      if (this.formulaire.value) {
        this.isLoadingResults=true;
        if (this.formulaire.value.guid) {

          this.indivisionsService.update(this.formulaire.value).subscribe(data => {
            this.isLoadingResults=false;
            this.openSnackBar("Contribuable indivision modifiée avec succès","OK");
            this.router.navigate([environment.FRONTEND_ROUTES.CONTRIBUABLE_INDIVISION]);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );

        } else {
          this.indivisionsService.add(this.formulaire.value).subscribe(data => {
            this.isLoadingResults=false;
            this.openSnackBar("Contribuable indivision ajoutée avec succès","OK");
            this.router.navigate([environment.FRONTEND_ROUTES.CONTRIBUABLE_INDIVISION]);
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


  public onSearchStatusJuridique(eventNgSelect){
    this.statusJuridiqueAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchCivilite(eventNgSelect) {
    this.civilityRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchNationalite(eventNgSelect) {
    this.nationaliteRemoteAutocomplete.term.next(eventNgSelect.term);
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


  /**************** memebre *********************/
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
  addNewMembre() {
    this.membres.insert(0, this.createMembreForm(null));
    this.onChangeQualite();
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
          this.indivisionsService.deleteMembresIndivision(this.indivision.guid,membre.value.id).subscribe(
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
  /****************fin memebre *********************/


  /**************** piece officielle *********************/

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
          this.pieceOfficielleService.delete(this.indivision.guid,pieceOfficielle.value.id).subscribe(
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



  /**************** indivision relation et qualité *********************/
  public qualiteList$ : QualiteRelation[]= [];
  public qualiteListSave$ :number[]= [];

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

  public currentRelation:IndivisionRelationElement;
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

  /**************** fin indivision relation et qualité *********************/


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
          this.contactContribuableService.deleteTelephone(this.indivision.guid,telephone.value.id).subscribe(
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
        email: [mail.value, Validators.compose([Validators.required, Validators.email])]
      });
    }else {
      return this.fb.group({
        id: [null],
        principal: [false],
        level: ["PROFESSIONAL", Validators.compose([Validators.required])],
        email: [null, Validators.compose([Validators.required, Validators.email])]
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
          this.contactContribuableService.deleteEmail(this.indivision.guid,email.value.id).subscribe(
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
          this.contactContribuableService.deleteAdresse(this.indivision.guid,adresse.value.id).subscribe(
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
          this.contactContribuableService.deleteReseauSocial(this.indivision.guid,reseauSociau.value.id).subscribe(
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
    return environment.FRONTEND_ROUTES.CONTRIBUABLE_INDIVISION+"/edition";
  }


}
