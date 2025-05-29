import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import {catchError, map, takeUntil} from 'rxjs/operators';
import {DateAdapter} from '@angular/material/core';
import {RemoteAutocompleteExtend} from '@sycadApp/shared/form-components/model/remote-autocomplete';
import {Civilite, StatusJuridiqueAutocomplete} from '@sycadApp/models/data-references/system/model';
import { CategorieActeur,
  Nationalite,
  NationaliteAutocomplete, ProfessionAutocomplete, RegimeFiscal, SecteurActivitePrincipale,
  SituationMatrimonialeAutocomplete, TitreHonorifiqueAutocomplete
} from '@sycadApp/models/data-references/contribuables/global.model';
import { of, Subject} from "rxjs";
import {AppConfirmService} from '@sycadApp/shared/app-confirm/app-confirm.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {getErrors} from '@sycadShared/validators/global-pattern';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {Router} from '@angular/router';
import {ActeurElement} from '@sycadApp/models/data-references/contribuables/acteur.model';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { NationaliteService } from '@sycadApp/services/data-references/system/nationalite.service';
import { CategorieActeurService } from '@sycadApp/services/data-references/system/categorie-acteur.service';
import { RegimeFiscalService } from '@sycadApp/services/impot/regime-fiscal.service';
import { SecteurActiviteService } from '@sycadApp/services/data-references/system/secteur-activite.service';
import { StatusJuridiqueService } from '@sycadApp/services/data-references/system/status-juridique.service';
import { CompteElement } from '@sycadApp/models/data-references/contribuables/compte.model';

@Component({
  selector: 'app-form-acteur',
  templateUrl: './form-acteur.component.html',
  styleUrls: ['./form-acteur.component.scss']
})
export class FormActeurComponent implements OnInit {

  @Input("formGroup") 
  formulaireActeur: FormGroup;

  
  @Input()
  public compteContribuable: CompteElement;



  public acteur: ActeurElement;
  public isLoadingResults = false;
  public formErrors: Array<string>;
  public maxDateNaissance;
  public minDateNaissance;
  public typeCompte: string;


  public nationaliteRemoteAutocomplete = new RemoteAutocompleteExtend<Nationalite>();
  public situationMatrimonialeRemoteAutocomplete = new RemoteAutocompleteExtend<SituationMatrimonialeAutocomplete>();
  public regimeFiscalRemoteAutocomplete = new RemoteAutocompleteExtend<RegimeFiscal>();
  public secteurActivitePrincipalRemoteAutocomplete = new RemoteAutocompleteExtend<SecteurActivitePrincipale>();
  public statusJuridiqueRemoteAutocomplete = new RemoteAutocompleteExtend<StatusJuridiqueAutocomplete>();
  public categorieActeurRemoteAutocomplete = new RemoteAutocompleteExtend<CategorieActeur>();

  private _onDestroy = new Subject<void>();
  public activeMediaQuery = '';

  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
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

 
  get regimeFiscal() {
    return this.formulaireActeur.get("regimeFiscal");
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

  

  get pieceOfficielle() {
    return this.formulaireActeur.get("pieceOfficielle");
  }

  get categorie(){return this.formulaireActeur.get("categorie");}

  get telephone() {return this.formulaireActeur.get("telephone");}

  get email() {return this.formulaireActeur.get("email");}
  get numeroIfu() { return this.formulaireActeur.get('numeroIfu');}

  constructor(public fb: FormBuilder, private _adapter: DateAdapter<any>,
              public confirmService: AppConfirmService,
              private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver,            
              public acteursService: ActeursService,
              public categorieActeurService: CategorieActeurService,
              public regimeFiscalService: RegimeFiscalService,
              public secteurActiviteService: SecteurActiviteService,
              public statusJuridiqueService: StatusJuridiqueService,             
              public nationaliteService: NationaliteService,
              private router: Router) {}

  ngOnInit(): void {


    setTimeout(()=>{  

      this.formulaireActeur.valueChanges.pipe(
        takeUntil(this._onDestroy)
      ).subscribe(() => {
        this.formErrors = getErrors(this.formulaireActeur);
      });
     });
    this._adapter.setLocale("fr");

    let currentDate = new Date();
    this.maxDateNaissance = new Date(currentDate.getFullYear() - 10, currentDate.getMonth(), currentDate.getDay());
    this.minDateNaissance = new Date(currentDate.getFullYear() - 70, currentDate.getMonth(), currentDate.getDay());

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

    this.regimeFiscalRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
    this.regimeFiscalRemoteAutocomplete.callbackAutocomplete=(search:string,params:Map<string,any>)=> {
      return this.regimeFiscalService.autocompletionPublic(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };

    this.secteurActivitePrincipalRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
    this.secteurActivitePrincipalRemoteAutocomplete.callbackAutocomplete=(search:string,params:Map<string,any>)=> {
      return this.secteurActiviteService.autocompletionPublic(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };

    this.categorieActeurRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
    this.categorieActeurRemoteAutocomplete.callbackAutocomplete=(search:string,params:Map<string,any>)=> {
      return this.categorieActeurService.autocompletionPublic(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };


    this.statusJuridiqueRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
    this.statusJuridiqueRemoteAutocomplete.callbackAutocomplete=(search:string,params:Map<string,any>)=> {
      return this.statusJuridiqueService.autocompletionPublic(search,params).pipe(
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

   
    if(informationsContribuable?.statusJuridique) {
      this.statusJuridiqueRemoteAutocomplete.listRessource$=of([informationsContribuable.statusJuridique]);
      this.statusJuridiqueRemoteAutocomplete.initialList=[informationsContribuable.statusJuridique];
    }

    if(informationsContribuable?.activitePrincipale) {
      this.secteurActivitePrincipalRemoteAutocomplete.listRessource$=of([informationsContribuable.activitePrincipale]);
      this.secteurActivitePrincipalRemoteAutocomplete.initialList=[informationsContribuable.activitePrincipale];
    }
    

    if(informationsContribuable.categorie) {
      this.categorieActeurRemoteAutocomplete.listRessource$=of([informationsContribuable.categorie]);
      this.categorieActeurRemoteAutocomplete.initialList=[informationsContribuable.categorie];
    }

    }
  }

 

  public onSearchSituationMatrimonial(eventNgSelect) {
    this.situationMatrimonialeRemoteAutocomplete.term.next(eventNgSelect.term);
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

}
