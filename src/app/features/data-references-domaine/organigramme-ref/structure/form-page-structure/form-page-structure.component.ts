import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import {of, Subject} from "rxjs";
import {DropzoneComponent, DropzoneConfigInterface} from "ngx-dropzone-wrapper";
import {RemoteAutocomplete,RemoteAutocompleteExtend} from "@sycadApp/shared/form-components/model/remote-autocomplete";
import {TypeStructureNestable} from "@sycadApp/models/data-references/organigramme/type-structure.model";
import {
  StructureAutocomplete,
  StructureElement,
  StructureParentItem
} from "@sycadApp/models/data-references/organigramme/structure.model";
import {MediaChange, MediaObserver} from "@angular/flex-layout";
import {ActivatedRoute, Router} from "@angular/router";
import {AppConfirmService} from "@sycadShared/app-confirm/app-confirm.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {TypeStructureService} from '@sycadApp/services/data-references/organigramme/type-structure.service';


import {SycadUtils} from "@sycadShared/utils.functions";
import {catchError, map, takeUntil} from "rxjs/operators";
import {
  getErrors,
  GlobalPattern
} from "@sycadShared/validators/global-pattern";
import {DateAdapter} from "@angular/material/core";
import {
  ArrondissementAutocomplete,
  ArrondissementElement
} from "@sycadApp/models/data-references/territoire/arrondissement.model";
import { CommuneAutocomplete } from '@sycadApp/models/data-references/territoire/commune.model';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { environment } from 'environments/environment';
import { NgSelectComponent } from '@ng-select/ng-select';
import {
  PersonneAContacter
} from "@sycadApp/models/data-references/contribuables/global.model";
import {
  TransitionFonctionnelle
} from "@sycadApp/models/data-references/organigramme/transition-fonctionnelle.model";
import {
  TransitionFonctionnelleService
} from "@sycadApp/services/data-references/system/transition-fonctionnelle.service";

@Component({
  selector: 'app-form-page-structure',
  templateUrl: './form-page-structure.component.html',
  styleUrls: ['./form-page-structure.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormPageStructureComponent implements OnInit {
  public formulaire: FormGroup;
  public structure: StructureElement;
  private _onDestroy = new Subject<void>();

  public isLoadingResults = false;

  @ViewChild(DropzoneComponent, { static: false }) dropzoneComponentRef?: DropzoneComponent;

  @ViewChild("remoteSelect", { static: true }) remoteSelect: NgSelectComponent;

  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    autoReset: null,
    resizeWidth :300,
    resizeHeight :300,
    errorReset: null,
    cancelReset: null
  };
  public documentPiece = '';
  public typeStructureRemoteAutocomplete = new RemoteAutocomplete<TypeStructureNestable>();
  public structureRemoteAutocomplete = new RemoteAutocomplete<StructureParentItem>();
  public arrondissementRemoteAutocomplete = new RemoteAutocompleteExtend<ArrondissementAutocomplete>();
  groupByFnArrondissement = (item) => item.commune.nom;
  groupValueFnArrondissement = (_: string, communes: any[]) => ({ name: communes[0].commune.nom, total: communes.length });


  public communeRemoteAutocomplete = new RemoteAutocomplete<CommuneAutocomplete>();
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  get touteArrondissement() {return this.formulaire.get('touteArrondissement');}
  get touteCommune() {return this.formulaire.get('touteCommune');}
  get sigle() {return this.formulaire.get('sigle');}
  get code(){ return this.formulaire.get('code');}
  get nom(){return this.formulaire.get('nom');}
  get parent() {return this.formulaire.get('parent');}
  get codeDownload() {return this.formulaire.get('codeDownload');}
  get localisation() {return this.formulaire.get('localisation');}
  get numeroBornage() {return this.formulaire.get('numeroBornage');}
  get typeStructure() {return this.formulaire.get('typeStructure');}
  get competenceArrondissement() {return this.formulaire.get('competenceArrondissement');}
  get competenceCommune() {return this.formulaire.get('competenceCommune');}
  get transitionFonctionnelles() { return this.formulaire.controls.transitionFonctionnelles as FormArray;}
  get structureDeDepot() { return this.formulaire.get('structureDeDepot'); }
  get structureDArchivage() { return this.formulaire.get('structureDArchivage'); }


  constructor(  public fb: FormBuilder,private router: Router,
                public confirmService: AppConfirmService,
                private route: ActivatedRoute,
                private _snackBar: MatSnackBar, private mediaObserver: MediaObserver,
                public structureService: StructureService,
                 public typeStructureService: TypeStructureService,
                public arrondissementService: ArrondissementsService,
                public communeService:CommunesService,
                public transitionFonctionnelleService:TransitionFonctionnelleService,
                private _adapter: DateAdapter<any>)
  {
    this.structure=this.route.snapshot.data["structure"];
    this.formulaire = this.fb.group({
      id: null,
      parent: [null],
      codeDownload: [null],
      sigle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      code: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      nom: [null],
      numeroBornage: [0],
      competenceArrondissement: [null],
      competenceCommune: [null],
      touteArrondissement: [false],
      touteCommune: [false],
      structureDeDepot: [false],
      structureDArchivage: [false],
      typeStructure: [null, Validators.compose([Validators.required])],
      localisation: this.fb.group({
        longitude: [null],
        lattitude: [null],
        designation: [null],
        localite: [null],
        quartier: [null],
        rue: [null],
        immeuble: [null],
        etage: [null],
        porte: [null],
        emailDeService: [null],
        telephoneDeService: [null]
      }),
      transitionFonctionnelles: new FormArray([]),
    });
  }
  public formErrors: Array<string>;
  ngOnInit(): void {



    setTimeout(()=>{

      this.formulaire.valueChanges.pipe(
        takeUntil(this._onDestroy)
      ).subscribe(() => {
        this.formErrors = getErrors(this.formulaire);
      });
     });

    this._adapter.setLocale("fr");

    this.typeStructureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.typeStructureService);
    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.structureService);

    if(!this.arrondissementRemoteAutocomplete.init) {

      let callbackAutocomplete=(search:string,params:Map<string,any>)=> {
        return this.arrondissementService.autocompletion(search,params).pipe(
          map(response => {
            return response.body;
          }),
          catchError((err) => {
             return of([]);
           })
        );
      };
      this.arrondissementRemoteAutocomplete.callbackAutocomplete=callbackAutocomplete;

      this.arrondissementRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
      this.arrondissementRemoteAutocomplete.mapFunction=(arrondissementAutocomplete: ArrondissementAutocomplete)=>{

        return arrondissementAutocomplete;
      }

    }

   // this.arrondissementRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.arrondissementService);

    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);
    if(this.structure) {

      if (this.structure.typeStructure) {
        this.typeStructureRemoteAutocomplete.listRessource$ = of([this.structure.typeStructure]);
        this.typeStructureRemoteAutocomplete.initialList = [this.structure.typeStructure];
      }

      this.structureRemoteAutocomplete.filtersId = [this.structure.id]
      if (this.structure.parent) {
        this.structureRemoteAutocomplete.listRessource$ = of([this.structure.parent]);
        this.structureRemoteAutocomplete.initialList = [this.structure.parent];
      }
      if(this.structure?.competenceArrondissement){
        this.arrondissementRemoteAutocomplete.listRessource$ = of(this.structure.competenceArrondissement);
        this.arrondissementRemoteAutocomplete.initialList = this.structure.competenceArrondissement;
        this.dataSourceArrondissement=this.structure.competenceArrondissement;
      }
      if(this.structure?.competenceCommune){
        this.communeRemoteAutocomplete.listRessource$ = of(this.structure.competenceCommune);
        this.communeRemoteAutocomplete.initialList = this.structure.competenceCommune;
        this.dataSourceCommune=this.structure.competenceCommune;
      }

    if(this.structure.logo) {
      this.documentPiece=this.structure.logo;
      this.codeDownload.setValue(null);
    }

    if (this.structure.transitionFonctionnelles) {
      this.structure.transitionFonctionnelles.map((transitionFonctionnelle) => {
        this.transitionFonctionnelles.insert(0, this.createTransitionFonctionnelle(transitionFonctionnelle));
      });
    }

      this.formulaire.patchValue({
        id: this.structure.id,
        sigle: this.structure.sigle,
        numeroBornage:this.structure.numeroBornage,
        code: this.structure.code,
        nom: this.structure.nom,
        competenceArrondissement: this.structure.competenceArrondissement.map(arrondissement => arrondissement.id),
        competenceCommune: this.structure.competenceCommune.map(commune => commune.id),
        codeDownload: null,
        parent: (this.structure.parent)?this.structure.parent?.id:null,
        typeStructure: this.structure.typeStructure?.id,
        localisation: this.structure.localisation || {},
        structureDArchivage: this.structure.structureDArchivage,
        structureDeDepot: this.structure.structureDeDepot
      });

    }else {
      this.structure = new StructureElement();
    }


    /*

    this.arrondissementRemoteAutocomplete.listRessource2$.subscribe(el=>{
     // console.log("avant open",this.remoteSelect);
      //this.remoteSelect.close();
      //this.remoteSelect.open();
     // console.log("avant open .items",this.remoteSelect.items);

      if(this.remoteSelect.items) {
        this.remoteSelect.dropdownPanel
      //  this.remoteSelect.items=[...this.remoteSelect.items];
      }

     if(this.remoteSelect){
        this.arrondissementRemoteAutocomplete.remoteSelect=this.remoteSelect;
      }
     });

     */
  }

  public onSearchTypeStructure(eventNgSelect){
    this.typeStructureRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchStructure(eventNgSelect){
    this.structureRemoteAutocomplete.term.next(eventNgSelect.term);
  }
public onSearchArrondissement(eventNgSelect){
    this.arrondissementRemoteAutocomplete.term.next(eventNgSelect.term);
}
public onChangeArrondissement(arrondissements){
  this.dataSourceArrondissement=arrondissements;
}
public displayedColumnsArrondissement: string[] = ['code', 'nom',"commune"];
public dataSourceArrondissement = [];


public onSearchCommune(eventNgSelect){
  this.communeRemoteAutocomplete.term.next(eventNgSelect.term);

}
public onChangeCommune(communes){
  this.dataSourceCommune=communes;
}
public displayedColumnsCommune: string[] = ['code', 'nom'];
public dataSourceCommune = [];

  resetForm(){
    this.router.navigate([`${environment.FRONTEND_ROUTES.ORGANIGRAMME_STRUCTURE}`]);

  }
  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    } else {
      if (this.formulaire.value) {
        this.isLoadingResults = true;
        if (this.formulaire.value.id) {

          this.structureService.update(this.formulaire.value).subscribe(data => {
              this.isLoadingResults = false;
              this.openSnackBar("La structure est modifiée avec succès", "OK");
              this.router.navigate([environment.FRONTEND_ROUTES.ORGANIGRAMME_STRUCTURE]);
            },
            errorResponse => {
              this.isLoadingResults = false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );

        } else {
          this.structureService.add(this.formulaire.value).subscribe(data => {
              this.isLoadingResults = false;
              this.openSnackBar("La structure est  ajoutée avec succès", "OK");
              this.router.navigate([environment.FRONTEND_ROUTES.ORGANIGRAMME_STRUCTURE]);
            },
            errorResponse => {
              this.isLoadingResults = false;
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

  public onUploadInit(args: any): void {

  }
  public resetDropZone(): void {
    this.dropzoneComponentRef.directiveRef.reset();
    this.codeDownload.setValue(null);
  }
  public onUploadError(args: any): void {
    this.dropzoneComponentRef.directiveRef.reset();
  }

  public onUploadSuccess(remoteResponse): void {
    this.codeDownload.setValue(remoteResponse[1].name);
  }

  addNewTransitionFonctionnelle() {
    this.transitionFonctionnelles.insert(0, this.createTransitionFonctionnelle(null));
  }

  removeTransitionFonctionnelle(index) {
    let transitionFonctionnelle = this.transitionFonctionnelles.at(index);
    if (transitionFonctionnelle.value.id) {
      this.confirmService.confirm({
        title:"Confirmation",
        message:`Voulez-vous supprimer cette personne contact ? `
      }).subscribe(($choix)=> {
        if($choix) {
          this.isLoadingResults=true;
          this.transitionFonctionnelleService.deleteTransitionFonctionnelle(this.structure.id,transitionFonctionnelle.value.id).subscribe(
            (result) => {
              this.isLoadingResults=false;
              this.openSnackBar("Element supprimé avec succès", "OK");
              this.transitionFonctionnelles.removeAt(index);
            },
            (errorResponseMembre) => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponseMembre.error, this._snackBar);
            }
          );
        }
      });
    } else {
      this.transitionFonctionnelles.removeAt(index);
    }
  }

  createTransitionFonctionnelle(transitionFonctionnelle:TransitionFonctionnelle) {
    if(transitionFonctionnelle) {

      const typeTransitionId = transitionFonctionnelle?.typeTransition?.id ?? null;

      const fb = this.fb.group({
        id: [transitionFonctionnelle.id],
        typeTransition: [transitionFonctionnelle.typeTransition, Validators.compose([Validators.required])],
        domaineFonctionnels: [
          transitionFonctionnelle.domaineFonctionnels.map(domaineFonctionnel => domaineFonctionnel),
          Validators.compose([Validators.required])
        ]
      });

      return fb;
    }else {
      return this.fb.group({
        id: [null],
        typeTransition: [null,Validators.compose([Validators.required])],
        domaineFonctionnels: [null,Validators.compose([Validators.required])],
      });
    }
  }
}
