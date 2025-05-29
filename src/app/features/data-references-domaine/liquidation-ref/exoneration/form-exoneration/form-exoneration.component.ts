import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Exoneration} from '@sycadApp/models/evaluation/exoneration.model';
import {of, Subject} from 'rxjs';
import {RemoteAutocomplete} from '@sycadApp/shared/form-components/model/remote-autocomplete';
import {
  ContribuableElement, GeneralContribuable
} from '@sycadApp/models/data-references/contribuables/global.model';
import {DropzoneComponent, DropzoneConfigInterface} from 'ngx-dropzone-wrapper';
import {NatureImpot} from '@sycadApp/models/impot/nature-impot.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {DateAdapter} from '@angular/material/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { ExonerationService } from '@sycadApp/services/evaluation/exoneration.service';
import { NatureImpotService } from '@sycadApp/services/impot/nature-impot.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';

import {takeUntil} from 'rxjs/operators';
import {getErrors} from '@sycadShared/validators/global-pattern';
import {ExonerationCategorie} from '@sycadApp/models/evaluation/exoneration-categorie.model';
import { ExonerationCategorieService } from '@sycadApp/services/evaluation/exoneration-categorie.service';
import {SycadUtils} from '@sycadShared/utils.functions';
import { ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';
import { environment } from 'environments/environment';
import { AdvancedRemoteAutocomplete } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/advanced-remote-autocomplete';


@Component({
  selector: 'app-form-exoneration',
  templateUrl: './form-exoneration.component.html',
  styleUrls: ['./form-exoneration.component.scss']
})
export class FormExonerationComponent implements OnInit {
public formulaire: FormGroup;
public exoneration: Exoneration;
  private _onDestroy = new Subject<void>();
  public isLoadingResults = false;
  public parcelleRemoteAutocomplete = new RemoteAutocomplete<ParcelleElement>();
  public contribuableRemoteAutocomplete = new AdvancedRemoteAutocomplete<GeneralContribuable>();
  public natureImpotRemoteAutocomplete = new RemoteAutocomplete<NatureImpot>();
 public categorieRemoteAutocomplete = new RemoteAutocomplete<ExonerationCategorie>();

  @ViewChild(DropzoneComponent, { static: false }) dropzoneComponentRef?: DropzoneComponent;
  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    autoReset: null,
    resizeWidth :300,
    resizeHeight :300,
    errorReset: null,
    cancelReset: null
  };
get motif() { return this.formulaire.get('motif');}
get refExterne() {return this.formulaire.get('refExterne');}
  get categorie() {return this.formulaire.get('categorie');}
  get dateDebut() {return this.formulaire.get('dateDebut');}
  get modifDoc() {return this.formulaire.get('modifDoc');}
  get dateFin() {return this.formulaire.get('dateFin');}
  get  taux() {return this.formulaire.get('taux');}
  get montant() {return this.formulaire.get('montant');}
  get contribuable() {return this.formulaire.get('contribuable');}
  get parcelle() {return this.formulaire.get(' parcelle');}
  get natureImpot() {return this.formulaire.get('natureImpot');}

  constructor(private router: Router,
              public confirmService: AppConfirmService,
              private route: ActivatedRoute, private mediaObserver: MediaObserver,
              private _adapter: DateAdapter<any>, private _snackBar: MatSnackBar,
              public fb: FormBuilder, public parcelleService: ParcelleService,
              public exonerationService: ExonerationService,
              public natureImpotService: NatureImpotService,
              public categorieService: ExonerationCategorieService, public contribuableService: ContribuableService)
  {
    this.exoneration = this.route.snapshot.data["exoneration"];
    this.formulaire = this.fb.group({
      id: [null],
      motif: [null, [Validators.required]],
      refExterne: [null, [Validators.required]],
      categorie: [null, [Validators.required]],
      dateDebut: [null],
      modifDoc: [null],
      dateFin: [null],
      taux: [null, [Validators.required]],
      montant: [null, [Validators.required]],
      contribuable: [null, [Validators.required]],
      parcelle: [null, [Validators.required]],
      natureImpot: [null, [Validators.required]],
      observation: [null]
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

    this.parcelleRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.parcelleService);
    this.natureImpotRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.natureImpotService);
    this.categorieRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.categorieService);



    if(this.exoneration){
      if(this.exoneration.categorie){
        this.categorieRemoteAutocomplete.listRessource$=of([this.exoneration.categorie]);
        this.categorieRemoteAutocomplete.initialList=[this.exoneration.categorie];
      }
       if (this.exoneration.contribuable) {
        this.contribuableRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([this.exoneration.contribuable]);
        this.contribuableRemoteAutocomplete.initialList = [this.exoneration.contribuable];
      }
      if(this.exoneration.parcelle){
        this.parcelleRemoteAutocomplete.listRessource$=of([this.exoneration.parcelle]);
        this.parcelleRemoteAutocomplete.initialList=[this.exoneration.parcelle];
      }
      if(this.exoneration.natureImpot){
        this.natureImpotRemoteAutocomplete.listRessource$=of([this.exoneration.natureImpot]);
        this.natureImpotRemoteAutocomplete.initialList= [this.exoneration.natureImpot];
      }
  
      this.formulaire.setValue({
        id: this.exoneration.id,
        motif: this.exoneration.motif,
        refExterne: this.exoneration.refExterne,
        montant: this.exoneration.montant,
        taux: this.exoneration.taux,
        dateDebut: this.exoneration.dateDebut,
        dateFin: this.exoneration.dateFin,
        observation: this.exoneration.observation,
        parcelle: this.exoneration.parcelle.id,
        natureImpot: this.exoneration.natureImpot?.id,
        categorie: this.exoneration.categorie?.id,
        contribuable: this.exoneration.contribuable ? this.exoneration.contribuable.guid : null,
        modifDoc: null
      });
    }else {
      this.exoneration = new Exoneration();
    }
  }
  public onSearchParcelle(eventNgSelect){
    this.parcelleRemoteAutocomplete.term.next(eventNgSelect.term);

  }

  public onSearchCategorie(evetNgSelect){
    this.categorieRemoteAutocomplete.term.next(evetNgSelect.term);
  }
  public onSearchNatureImpot(eventNgSelect){
    this.natureImpotRemoteAutocomplete.term.next(eventNgSelect.term);
  }



  receiveSubjectContribuable(acteur: any) {
    // this.attribution.acteur= acteur;
  }
  resetForm(){
    this.formulaire.reset();

  }
  onSubmit() {

    if (!this.formulaire.valid) {
      return false;
    } else {

      if (this.formulaire.value) {
        this.isLoadingResults=true;
        if (this.formulaire.value.id) {
          this.exonerationService.update(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("Exoneration modifié avec succès","OK");
              this.router.navigate([environment.FRONTEND_ROUTES.CONFIGURATION_EXONERATION]);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        } else {
          this.exonerationService.add(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("Exoneration  ajouté avec succès","OK");
              this.router.navigate([environment.FRONTEND_ROUTES.CONFIGURATION_EXONERATION]);
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
  public onUploadInit(args: any): void {

  }
  public resetDropZone(): void {
    this.dropzoneComponentRef.directiveRef.reset();
    this.modifDoc.setValue(null);
  }
  public onUploadError(args: any): void {
    this.dropzoneComponentRef.directiveRef.reset();
  }

  public onUploadSuccess(remoteResponse): void {
    this.modifDoc.setValue(remoteResponse[1].name);
  }




  
}
