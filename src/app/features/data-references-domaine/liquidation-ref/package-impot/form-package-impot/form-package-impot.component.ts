import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {of, Subject} from 'rxjs';
import {PackageImpot} from '@sycadApp/models/impot/package-impot.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import { PackageImpotService } from '@sycadApp/services/impot/package-impot.service';
import {SycadUtils} from '@sycadShared/utils.functions';
import {RemoteAutocomplete} from '@sycadApp/shared/form-components/model/remote-autocomplete';
import {NatureImpot} from '@sycadApp/models/impot/nature-impot.model';
import {ElementImpot, Formule} from '@sycadApp/models/impot/element-impot.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {DateAdapter} from '@angular/material/core';
import {takeUntil} from 'rxjs/operators';
import {getErrors} from '@sycadShared/validators/global-pattern';
import { NatureImpotService } from '@sycadApp/services/impot/nature-impot.service';
import {ElementLiquidation} from '@sycadApp/models/impot/element-liquidation.model';
import {Processus} from '@sycadApp/models/workflow/common/general';
import { ElementLiquidationService } from '@sycadApp/services/impot/element-liquidation.service';
import { ProcessusService } from '@sycadApp/services/workflow/processus.service';
import { environment } from 'environments/environment';
import {
  CessionSource
} from "@sycadApp/models/workflow/common/attribution-source.model";
import {
  CessionSourceService
} from "@sycadApp/services/impot/cession-source.service";
import {
  TypeTitreRecetteService
} from "@sycadApp/services/impot/type-titre-recette.service";
import {
  TypeTitreRecette
} from "@sycadApp/models/impot/type-titre-recette.model";


@Component({
  selector: 'app-form-package-impot',
  templateUrl: './form-package-impot.component.html',
  styleUrls: ['./form-package-impot.component.scss']
})
export class FormPackageImpotComponent implements OnInit {
public formulaire: FormGroup;
private _onDestroy = new Subject<void>();
public packageImpot: PackageImpot;
  public isLoadingResults = false;

contribuableTypes = [
  "CONTRIBUABLEPHYSIQUE",
  "CONTRIBUABLEMORAL"
];

public natureImpotRemoteAutocomplete = new RemoteAutocomplete<NatureImpot>();
public elementLiquidationRemoteAutocomplete = new RemoteAutocomplete<ElementLiquidation>();
public processusRemoteAutocomplete = new RemoteAutocomplete<Processus>();
public cessionSourceRemoteAutocomplte = new RemoteAutocomplete<CessionSource>();
public typeTireRecetteRemoteAutocomplte = new RemoteAutocomplete<TypeTitreRecette>();
get code() {return this.formulaire.get('code');}
get libelle(){ return this.formulaire.get('libelle');}
get typeContribuable() {return this.formulaire.get('typeContribuable');}
get dateDebut(){ return this.formulaire.get('dateDebut');}
get dateFin(){return this.formulaire.get('dateFin');}
get delaiReglementMois(){ return this.formulaire.get('delaiReglementMois');}
get tauxPenaliteHorsDelai(){ return this.formulaire.get('tauxPenaliteHorsDelai');}
get tauxInteretSurPenalite(){ return this.formulaire.get('tauxInteretSurPenalite');}
get periodeInteretSurPenalite(){ return this.formulaire.get('periodeInteretSurPenalite');}
get unite(){return this.formulaire.get('unite');}
get natureImpot(){return this.formulaire.get('natureImpot');}
get getElementImpot(){return this.formulaire.controls.elementsImpots as FormArray;}
get refLoi(){ return this.formulaire.get('refLoi');}
get observation(){ return this.formulaire.get('observation');}
get isActive() { return this.formulaire.get('isActive');}
get ordreTri(){ return this.formulaire.get('ordreTri');}
get baseImpot(){ return this.formulaire.get('elementsImpots').get('baseImpot');}
get taux(){ return this.formulaire.get('elementsImpots').get('taux');}
get elementLiquidation(){ return this.formulaire.get('elementsImpots').get('elementLiquidation');}
get codeProcessus(){return this.formulaire.get('codeProcessus');}
get actif(){ return this.formulaire.get('actif');}
get parDefaut(){ return this.formulaire.get('parDefaut');}
  get cessionSource(){return this.formulaire.get('cessionSource');}
  constructor(private router: Router,
              public confirmService: AppConfirmService,
              private route: ActivatedRoute, private mediaObserver: MediaObserver,
              private _adapter: DateAdapter<any>,
              public fb: FormBuilder, public _snackBar: MatSnackBar,
              public packageImpotService: PackageImpotService,
              public natureImpotService: NatureImpotService,
              public elementLiquidationService: ElementLiquidationService,
              public processusService: ProcessusService,
              public attributionSourceService: CessionSourceService,
              public typeTitreRecetteService: TypeTitreRecetteService)
  {
    this.packageImpot = this.route.snapshot.data["packageImpot"];
    this.formulaire = this.fb.group({
      id: [null],
      code: [ null, [Validators.required]],
      libelle: [null, [Validators.required]],
      typeContribuable: [null, [Validators.required]],
      dateDebut: [null, [Validators.required]],
      dateFin: [null, [Validators.required]],
      unite: [null],
      delaiReglementMois: [3, [Validators.required]],
      tauxPenaliteHorsDelai: [10, [Validators.required]],
      tauxInteretSurPenalite: [1, [Validators.required]],
      periodeInteretSurPenalite: [1, [Validators.required]],
      natureImpot: [null],
      refLoi: [null],
      observation: [null],
      ordreTri: [null],
      elementsImpots: new FormArray([]),
      codeProcessus: [null, [Validators.required]],
      actif: [false],
      parDefaut: [false],
      cessionSource: [null],
      typeTitreRecette: [null],
      estObligatoire: [false]
    });
  }

  public formErrors: Array<string>;
  public activeMediaQuery = '';

  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  ngOnInit(): void {

    this.formulaire.valueChanges.pipe(
      takeUntil(this._onDestroy)
    ).subscribe(() => {
      this.formErrors = getErrors(this.formulaire);
    });

    this._adapter.setLocale("fr");

   this.natureImpotRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.natureImpotService);
  this.elementLiquidationRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.elementLiquidationService);
  this.processusRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.processusService);
  this.cessionSourceRemoteAutocomplte.initializeRemoteAutocompletion(this._onDestroy, this.attributionSourceService);
  this.typeTireRecetteRemoteAutocomplte.initializeRemoteAutocompletion(this._onDestroy, this.typeTitreRecetteService);
  if(this.packageImpot){

    if(this.packageImpot.natureImpot){
      this.natureImpotRemoteAutocomplete.listRessource$=of ([this.packageImpot.natureImpot]);
      this.natureImpotRemoteAutocomplete.initialList=[this.packageImpot.natureImpot];
    }
   if (this.packageImpot.elementsImpots){
     this.packageImpot.elementsImpots.map(elementImpot => {
       this.getElementImpot.insert(0, this.createElementsImpot(elementImpot));
     });
   }
   if(this.packageImpot.processus){
     this.processusRemoteAutocomplete.listRessource$=of([this.packageImpot.processus]);
     this.processusRemoteAutocomplete.initialList=[this.packageImpot.processus];
   }
    this.formulaire.patchValue({
      id: this.packageImpot.id,
      code: this.packageImpot.code,
      libelle: this.packageImpot.libelle,
      typeContribuable: this.packageImpot.typeContribuable,
      dateDebut: this.packageImpot.dateDebut,
      dateFin: this.packageImpot.dateFin,
      unite: this.packageImpot.unite,
      delaiReglementMois: this.packageImpot.delaiReglementMois,
      tauxPenaliteHorsDelai: this.packageImpot.tauxPenaliteHorsDelai,
      tauxInteretSurPenalite: this.packageImpot.tauxInteretSurPenalite,
      periodeInteretSurPenalite: this.packageImpot.periodeInteretSurPenalite,
      refLoi: this.packageImpot.refLoi,
      observation: this.packageImpot.observation,
      natureImpot: this.packageImpot.natureImpot?.id,
      codeProcessus: this.packageImpot.processus?.code,
      elementsImpots: [],
      ordreTri: this.packageImpot.ordreTri,
      actif: this.packageImpot.actif,
      parDefaut: this.packageImpot.parDefaut,
      cessionSource: this.packageImpot.cessionSource?.id,
      typeTitreRecette: this.packageImpot.typeTitreRecette?.id,
      estObligatoire: this.packageImpot.estObligatoire
    });
  } else {
    this.packageImpot = new PackageImpot();
  }
  }
public onSearchNatureImpot(eventNgSelect){
    this.natureImpotRemoteAutocomplete.term.next(eventNgSelect.term);
}
  public onSearchTypeTitreRecette(eventNgSelect){
    this.typeTireRecetteRemoteAutocomplte.term.next(eventNgSelect.term);
  }
  onSearchProcessus(eventNgSelect){
    this.processusRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchCessionSource(eventNgSelect) {
    this.cessionSourceRemoteAutocomplte.term.next(eventNgSelect.term);
  }
  resetForm(){
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_PACKAGE_IMPOT}`]);

  }

  onSubmit(){
    if (!this.formulaire.valid) {
      return false;
    } else {


      if (this.formulaire.value) {
        this.isLoadingResults=true;
        if (this.formulaire.value.id) {
          this.packageImpotService.update(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("Package impôt modifié avec succès","OK");
              this.router.navigate([environment.FRONTEND_ROUTES.CONFIGURATION_PACKAGE_IMPOT]);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        } else {
          this.packageImpotService.add(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("Package impôt  ajouté avec succès","OK");
              this.router.navigate([environment.FRONTEND_ROUTES.CONFIGURATION_PACKAGE_IMPOT]);
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  createElementsImpot(elementImpot: ElementImpot){
    if(elementImpot){
      return this.fb.group({
        id: [elementImpot.id],
        baseImpot: this.fb.group({
          id:elementImpot.baseImpot.id,
          titre:elementImpot.baseImpot.titre,
          expression:elementImpot.baseImpot.expression
        }),
        modifiable: [elementImpot.modifiable],
        ordreTrie: [elementImpot.ordreTrie],
        elementLiquidation: [elementImpot.elementLiquidation, Validators.compose([Validators.required])],
        taux: this.fb.group({
          id:elementImpot.taux.id,
          titre:elementImpot.taux.titre,
          expression:elementImpot.taux.expression
        })
      });
    }else {
      return this.fb.group({
        id: [null],
        baseImpot: this.fb.group({
          id:[null],
          titre: [null, Validators.compose([Validators.required]) ],
          expression: [null, Validators.compose([Validators.required]) ]
        }),
        modifiable: [null || false],
        ordreTrie: [null],
        elementLiquidation: [null,  Validators.compose([Validators.required])],
        taux: this.fb.group({
          id:[null],
          titre: [null, Validators.compose([Validators.required]) ],
          expression: [null, Validators.compose([Validators.required]) ]
        })
      });
    }
  }

  addNewElementImpot(){
    this.getElementImpot.insert(0, this.createElementsImpot(null));
  }

  removeElementImpot(index){
    let elementsImpots = this.getElementImpot.at(index);
    if (elementsImpots.value.id) {
      this.confirmService.confirm({
        title:"Confirmation",
        message:`Voulez-vous supprimer cet élément impôt ? `
      }).subscribe(($choix)=> {

        if($choix) {
          this.isLoadingResults=true;
          this.packageImpotService.deleteElementsImpot(this.packageImpot.id, elementsImpots.value.id).subscribe(
            (result) => {
              this.isLoadingResults=false;
              this.openSnackBar("Element supprimé avec succès", "OK");
              this.getElementImpot.removeAt(index);
            },
            (errorResponseMembre) => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponseMembre.error, this._snackBar);
            }
          );
        }

      });
    } else {
      this.getElementImpot.removeAt(index);
    }
  }
}
