import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import {Civilite,} from '@sycadApp/models/data-references/system/model';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {DateAdapter} from '@angular/material/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CiviliteService} from '@sycadApp/services/data-references/system/civilite-service.service';
import {SituationMatrimonialeService} from '@sycadApp/services/data-references/system/situationMatrimoniale.service';
import {NationaliteService} from '@sycadApp/services/data-references/system/nationalite.service';
import {ProfessionService} from '@sycadApp/services/data-references/system/profession.service';
import {AppConfirmService} from '@sycadApp/shared/app-confirm/app-confirm.service';
import {catchError, map, takeUntil} from 'rxjs/operators';
import { Observable, of, Subject} from 'rxjs';
import {AdresseMinimumExist, getErrors, GlobalPattern} from '@sycadShared/validators/global-pattern';
import {
  AdresseContribuable,
  Nationalite,
  NationaliteAutocomplete, ProfessionAutocomplete,
  SituationMatrimonialeAutocomplete
} from '@sycadApp/models/data-references/contribuables/global.model';
import { RemoteAutocompleteExtend } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { Processus } from '@sycadApp/models/workflow/common/general';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { StructureAutocomplete } from '@sycadApp/models/data-references/organigramme/structure.model';
import { StructureService } from '@sycadApp/services/data-references/organigramme/structure.service';
import { CompteElement } from '@sycadApp/models/data-references/contribuables/compte.model';
import { SycadUtils } from '@sycadApp/shared/utils.functions';



@Component({
  selector: 'app-form-contribuable-physique',
  templateUrl: './form-contribuable-physique.component.html',
  styleUrls: ['./form-contribuable-physique.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormContribuablePhysiqueComponent implements OnInit {
  @Input("formGroup")
  formulaireContribuablePhysique: FormGroup;

  public maskTelephone = ['0', '0', '2', '2', '6', ' ', /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/];

  @Input()
  public processus: Processus;

  @Input()
  public compteContribuable: CompteElement;

  public autocompletionByIlotLibreOrByOwn:(search:string,params:Map<string,any>)=>Observable<any[]>;

  public isLoadingResults = false;
  public formErrors: Array<string>;
  public maxDateNaissance;
  public minDateNaissance;

  public civilityRemoteAutocomplete = new RemoteAutocompleteExtend<Civilite>();
  public nationaliteRemoteAutocomplete = new RemoteAutocompleteExtend<Nationalite>();
  public situationMatrimonialeRemoteAutocomplete = new RemoteAutocompleteExtend<SituationMatrimonialeAutocomplete>();
  public professionRemoteAutocomplete = new RemoteAutocompleteExtend<ProfessionAutocomplete>();



  private _onDestroy = new Subject<void>();
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  get prenoms() { return this.formulaireContribuablePhysique.get('prenoms'); }
  get nom() { return this.formulaireContribuablePhysique.get('nom'); }
  get nomDeJeuneFille() { return this.formulaireContribuablePhysique.get('nomDeJeuneFille'); }
  get situationMatrimoniale() { return this.formulaireContribuablePhysique.get('situationMatrimoniale'); }
  get profession() { return this.formulaireContribuablePhysique.get('profession'); }
  get nationalite() { return this.formulaireContribuablePhysique.get('nationalite');}
  get genre() { return this.formulaireContribuablePhysique.get('genre'); }
  get dateNaissance() { return this.formulaireContribuablePhysique.get('dateNaissance'); }
  get lieuNaissance() { return this.formulaireContribuablePhysique.get('lieuNaissance'); }
  get pieceOfficielle() { return this.formulaireContribuablePhysique.get("pieceOfficielle") ;}
  get telephone() { return this.formulaireContribuablePhysique.get('telephone');}
  get email() { return this.formulaireContribuablePhysique.get('email');}
  get document() { return this.formulaireContribuablePhysique.get('document');}
  get parcelle() { return this.formulaireContribuablePhysique.get('parcelle');}
  get structure() { return this.formulaireContribuablePhysique.get('structure');}
  get numeroIfu() { return this.formulaireContribuablePhysique.get('numeroIfu');}
  get detientParcelle() { return this.formulaireContribuablePhysique.get("detientParcelle");}
  get adresses() {
    return this.formulaireContribuablePhysique.controls.adresses as FormArray;
  }

  constructor(public fb: FormBuilder, private _adapter: DateAdapter<any>,
              public civiliteService: CiviliteService,
              public situationMatrimonialeService: SituationMatrimonialeService,
              public nationaliteService: NationaliteService,
              public professionService: ProfessionService,
              public professionServicee: ProfessionService,
              public confirmService: AppConfirmService,
              public structureService: StructureService,
              private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver) {


              }



  ngOnInit(): void {

    setTimeout(()=>{

      this.formulaireContribuablePhysique.valueChanges.pipe(
        takeUntil(this._onDestroy)
      ).subscribe(() => {
        this.formErrors = getErrors(this.formulaireContribuablePhysique);
      });
     });


    this._adapter.setLocale("fr");

    let currentDate = new Date();
    this.maxDateNaissance = new Date(currentDate.getFullYear() - 10, currentDate.getMonth(), currentDate.getDay());
    this.minDateNaissance = new Date(currentDate.getFullYear() - 70, currentDate.getMonth(), currentDate.getDay());




    this.detientParcelle.valueChanges.pipe(
      takeUntil(this._onDestroy)
    ).subscribe((detientUneParcelle) => {
      if(detientUneParcelle){
        this.formulaireContribuablePhysique.addControl("document",this.createDocument(true));
        this.formulaireContribuablePhysique.addControl("parcelle",this.formParcelle());
      }else {
        this.formulaireContribuablePhysique.removeControl("document");
        this.formulaireContribuablePhysique.removeControl("parcelle");
      }
    });



    this.civilityRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
    this.civilityRemoteAutocomplete.callbackAutocomplete=(search:string,params:Map<string,any>)=> {
      return this.civiliteService.autocompletionPublic(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };


    this.situationMatrimonialeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
    this.situationMatrimonialeRemoteAutocomplete.callbackAutocomplete=(search:string,params:Map<string,any>)=> {
      return this.situationMatrimonialeService.autocompletionPublic(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };

    this.nationaliteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
    this.nationaliteRemoteAutocomplete.callbackAutocomplete=(search:string,params:Map<string,any>)=> {
      return this.nationaliteService.autocompletionPublic(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };


    this.professionRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
    this.professionRemoteAutocomplete.callbackAutocomplete=(search:string,params:Map<string,any>)=> {
      return this.professionService.autocompletionPublic(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };
    if(this.compteContribuable) {
      let informationsContribuable =  this.compteContribuable.informationsContribuable;

    if(informationsContribuable?.nationalite) {
      this.nationaliteRemoteAutocomplete.listRessource$=of([informationsContribuable.nationalite]);
      this.nationaliteRemoteAutocomplete.initialList=[informationsContribuable.nationalite];
    }

    if(informationsContribuable?.civilite) {
      this.civilityRemoteAutocomplete.listRessource$=of([informationsContribuable.civilite]);
      this.civilityRemoteAutocomplete.initialList=[informationsContribuable.civilite];
    }

    if(informationsContribuable?.situationMatrimoniale) {
      this.situationMatrimonialeRemoteAutocomplete.listRessource$=of([informationsContribuable.situationMatrimoniale]);
      this.situationMatrimonialeRemoteAutocomplete.initialList=[informationsContribuable.situationMatrimoniale];
    }

    if(informationsContribuable?.situationMatrimoniale) {
      this.situationMatrimonialeRemoteAutocomplete.listRessource$=of([informationsContribuable.situationMatrimoniale]);
      this.situationMatrimonialeRemoteAutocomplete.initialList=[informationsContribuable.situationMatrimoniale];
    }

    if(informationsContribuable?.profession) {
      this.professionRemoteAutocomplete.listRessource$=of([informationsContribuable.profession]);
      this.professionRemoteAutocomplete.initialList=[informationsContribuable.profession];
    }

    if(informationsContribuable?.nationalite) {
      this.nationaliteRemoteAutocomplete.listRessource$=of([informationsContribuable.nationalite]);
      this.nationaliteRemoteAutocomplete.initialList=[informationsContribuable.nationalite];
    }



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
  public onSearchCivilite(eventNgSelect) {
    this.civilityRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchSituationMatrimonial(eventNgSelect) {
    this.situationMatrimonialeRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchNationalite(eventNgSelect) {
    this.nationaliteRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchProfession(eventNgSelect) {
    this.professionRemoteAutocomplete.term.next(eventNgSelect.term);
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
