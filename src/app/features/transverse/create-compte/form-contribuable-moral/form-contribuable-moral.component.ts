import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Civilite, StatusJuridiqueAutocomplete} from '@sycadApp/models/data-references/system/model';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {DateAdapter} from '@angular/material/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {CiviliteService} from '@sycadApp/services/data-references/system/civilite-service.service';
import {SituationMatrimonialeService} from '@sycadApp/services/data-references/system/situationMatrimoniale.service';
import {NationaliteService} from '@sycadApp/services/data-references/system/nationalite.service';
import {ProfessionService} from '@sycadApp/services/data-references/system/profession.service';
import {AppConfirmService} from '@sycadApp/shared/app-confirm/app-confirm.service';
import {catchError, map, takeUntil} from 'rxjs/operators';
import { Subject, of} from 'rxjs';
import {AdresseMinimumExist, getErrors, GlobalPattern} from '@sycadShared/validators/global-pattern';
import {
  AdresseContribuable,
  CategorieActeur,
  Nationalite, ProfessionAutocomplete, RegimeFiscal, SecteurActivitePrincipale,
  SituationMatrimonialeAutocomplete, TitreHonorifiqueAutocomplete
} from '@sycadApp/models/data-references/contribuables/global.model';
import {CategorieActeurService} from '@sycadApp/services/data-references/system/categorie-acteur.service';
import {RegimeFiscalService} from '@sycadApp/services/impot/regime-fiscal.service';
import {SecteurActiviteService} from '@sycadApp/services/data-references/system/secteur-activite.service';
import {StatusJuridiqueService} from '@sycadApp/services/data-references/system/status-juridique.service';
import { ServiceAdministratifService } from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';
import { StructureService } from '@sycadApp/services/data-references/organigramme/structure.service';
import { BureauService } from '@sycadApp/services/data-references/organigramme/bureau.service';
import { RemoteAutocompleteExtend } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { Processus } from '@sycadApp/models/workflow/common/general';
import { StructureAutocomplete } from '@sycadApp/models/data-references/organigramme/structure.model';
import { CompteElement } from '@sycadApp/models/data-references/contribuables/compte.model';

@Component({
  selector: 'app-form-contribuable-moral',
  templateUrl: './form-contribuable-moral.component.html',
  styleUrls: ['./form-contribuable-moral.component.scss']
})
export class FormContribuableMoralComponent implements OnInit {

  public maskTelephone = ['0', '0', '2', '2', '6', ' ', /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/];

  @Input("formGroup")
  formulaireContribuable: FormGroup;

  @Input()
  public compteContribuable: CompteElement;


  public isLoadingResults = false;
  public formErrors: Array<string>;
  public maxDateNaissance;
  public minDateNaissance;

  @Input()
  public processus: Processus;


  private _onDestroy = new Subject<void>();
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
   // get dateDeCreation() {return this.formulaireContribuable.get("dateDeCreation");}
   // get numCNSS() {return this.formulaireContribuable.get("numCNSS");}
 // get pieceOfficielle() {return this.formulaireContribuable.get("pieceOfficielle");}
   // get denomination() {return this.formulaireContribuable.get("denomination");}
  get sigle() {return this.formulaireContribuable.get("sigle");}
   // get regimeFiscal() {return this.formulaireContribuable.get("regimeFiscal");}
   // get statusJuridique() {return this.formulaireContribuable.get('statusJuridique');}
   // get activitePrincipale() {return this.formulaireContribuable.get("activitePrincipale");}
  get telephone() { return this.formulaireContribuable.get("telephone");}
  get email() { return this.formulaireContribuable.get("email");}
  get document() { return this.formulaireContribuable.get('document');}
  get parcelle() { return this.formulaireContribuable.get('parcelle');}
   // get structure() { return this.formulaireContribuable.get('structure');}
  get numeroIfu() { return this.formulaireContribuable.get('numeroIfu');}
  get detientParcelle() { return this.formulaireContribuable.get("detientParcelle");}

  get adresses() {
    return this.formulaireContribuable.controls.adresses as FormArray;
  }

  constructor(public fb: FormBuilder, private _adapter: DateAdapter<any>,
              public confirmService: AppConfirmService,
              private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver,
              public categorieActeurService: CategorieActeurService,
              public regimeFiscalService: RegimeFiscalService,
              public secteurActiviteService: SecteurActiviteService,
              public statusJuridiqueService: StatusJuridiqueService,
              public serviceAdminService: ServiceAdministratifService,
              public structureService: StructureService,
              public bureauService: BureauService,
              public civiliteService: CiviliteService,
              public situationMatrimonialeService: SituationMatrimonialeService,
              public nationaliteService: NationaliteService,
              public professionService: ProfessionService,
              private router: Router) {}

  ngOnInit(): void {

    setTimeout(()=>{

      this.formulaireContribuable.valueChanges.pipe(
        takeUntil(this._onDestroy)
      ).subscribe(() => {
        this.formErrors = getErrors(this.formulaireContribuable);
      });
     });


    this._adapter.setLocale("fr");

    this.detientParcelle.valueChanges.pipe(
      takeUntil(this._onDestroy)
    ).subscribe((detientUneParcelle) => {
      if(detientUneParcelle){
        this.formulaireContribuable.addControl("document",this.createDocument(true));
        this.formulaireContribuable.addControl("parcelle",this.formParcelle());
      }else {
        this.formulaireContribuable.removeControl("document");
        this.formulaireContribuable.removeControl("parcelle");
      }
    });

    let currentDate = new Date();
    this.maxDateNaissance = new Date(currentDate.getFullYear() - 10, currentDate.getMonth(), currentDate.getDay());
    this.minDateNaissance = new Date(currentDate.getFullYear() - 70, currentDate.getMonth(), currentDate.getDay());



    if(this.compteContribuable) {
      let informationsContribuable =  this.compteContribuable.informationsContribuable;



    }

  }



  createDocument(isNewDossier:Boolean=true) {

    if(isNewDossier){
      return this.fb.group({
        numero: [null, [Validators.required]],
        pieceJointe: [null, [Validators.required]],
     //   dateValidite: [null],
        documentType: [null, [Validators.required]],
        dateDoc: [null, [Validators.required]]
      });
    }else {
      return this.fb.group({
        numero: [null, [Validators.required]],
        pieceJointe: [null],
   //     dateValidite: [null],
        documentType: [null, [Validators.required]],
        dateDoc: [null, [Validators.required]]
      });
    }


  }

  formParcelle(){
    return  this.fb.group({
      commune: [null, Validators.compose([Validators.required])],
      section: [null, Validators.compose([Validators.required])],
      ilot: [null, Validators.compose([Validators.required])],
      numero: [null, Validators.compose([Validators.required,GlobalPattern.numeroParcelle] ),],
      numeroAncien: [null]
    });

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
        this.adresses.removeAt(index);
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

}
