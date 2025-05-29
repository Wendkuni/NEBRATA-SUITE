import { Component, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild, ViewEncapsulation, } from '@angular/core';
import { ControlValueAccessor, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '@sycadShared/app-confirm/app-confirm.service';
import { DateAdapter } from '@angular/material/core';
import { MatTabGroup } from '@angular/material/tabs';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import { CategoriePieceProcessus } from '@sycadApp/models/workflow/common/general';

import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { of, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import { SdEntetePVService } from '@sycadApp/services/workflow/sd-entetePV.service';
import { TransitionEntetePVComponent } from '../transition-saisie-attribution.component';
import { EntetePV } from '@sycadApp/models/workflow/sd-entete-pv.model';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import {
  RemoteAutocompleteArrondissementZoneCompetence,
  RemoteAutocompleteCommuneZoneCompetence
} from '@sycadApp/features/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence';
import { CommuneAutocomplete } from '@sycadApp/models/data-references/territoire/commune.model';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { CessionSourceService } from '@sycadApp/services/impot/cession-source.service';
import { CessionSourceType } from '@sycadApp/models/workflow/common/attribution-source.model';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { AdvancedRemoteAutocomplete } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/advanced-remote-autocomplete';
import { catchError, map } from 'rxjs/operators';
import {
  DocumentTypeService
} from "@sycadApp/services/data-references/system/document-type.service";
import {
  DocumentType
} from "@sycadApp/models/data-references/system/document-type.model";
import {
  ArrondissementsService
} from "@sycadApp/services/data-references/territoire/arrondissements.service";
import {
  ArrondissementAutocomplete
} from "@sycadApp/models/data-references/territoire/arrondissement.model";

@Component({
  selector: 'app-creation-saisie-pv-attribution',
  templateUrl: './creation-saisie-pv-attribution.component.html',
  styleUrls: ['./creation-saisie-pv-attribution.component.scss']
})
export class CreationSaisiePvAttributionComponent extends TransitionEntetePVComponent implements OnInit, OnDestroy, OnChanges {

  document: FormGroup;
  @ViewChild('stepper') stepper: MatTabGroup; selectedIndex = 0;



  onChange: any = (_: Number) => {};

  onTouch: any = () => {};

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public entetePVService: SdEntetePVService,
    public categoriePieceService: CategoriePieceService,
    public communeService: CommunesService,
    public attributionSourceService: CessionSourceService,
    public documentTypeService: DocumentTypeService,
    public arrondissementService: ArrondissementsService,
    ) {
    super(router,_snackBar, confirmService, _adapter, mediaObserver, fb, entetePVService, categoriePieceService, communeService, documentTypeService,attributionSourceService,arrondissementService);


  }



  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  ngOnInit(): void {

    this._adapter.setLocale("fr");

    this.entetePV = new EntetePV();

    this.cessionSourceRemoteAutocomplte.params.set("type", CessionSourceType.ATTRIBUTION);
    this.cessionSourceRemoteAutocomplte.initializeRemoteAutocompletion(this._onDestroy, this.attributionSourceService);
  //this.documentTypeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.documentTypeService);
    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);
    this.arrondissementRemoteAutocomplete= new RemoteAutocompleteArrondissementZoneCompetence<ArrondissementAutocomplete>();
    this.typeDocuments=this.processus.typeDocuments;
  }





  public onSearchCommune(eventNgSelect) {
    this.communeRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    //this.subscription.unsubscribe();
  }
  ngOnChanges(simpleChanges: SimpleChanges) {

    if (simpleChanges['touched'] && simpleChanges['touched'].currentValue) {
      // this.parcelleForm.markAllAsTouched();
    }
  }



  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: Number) => {}): void {
    // this.sync();
    this.onTouch = fn;
  }



  public onSearchCategoriePiece(eventNgSelect) {
    this.categorieIdentiteRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public categoriePieceProcessus$: CategoriePieceProcessus[] = [];
  public idCategoriePieceListChosen$: number[] = [];
  public changeCategoriePiece(data: CategoriePieceProcessus) {
    this.idCategoriePieceListChosen$ = [];
    /*
    for (let i = 0; i < this.pieces.length; i++) {
      let piece = this.pieces.at(i);
      this.idCategoriePieceListChosen$.push(piece.value.categorie);
    }
    let that = this;
    this.categoriePieceProcessus$ = this.processus.categoriePieces.filter((piece) => {
      return (that.idCategoriePieceListChosen$.indexOf(piece.id) < 0);
    });
*/
  }
  addNewDossierPiece() {
    //if (this.categoriePieceProcessus$.length > 0) {
      super.addNewDossierPiece();
  //  }
  }
  removeDossierPiece(i) {
    super.removeDossierPiece(i);
    this.changeCategoriePiece(null);
  }
  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }



   this.loadingEvent.emit(true);

    let { dossier, cessionSource, documentDeSortie,arrondissement } = this.formulaire.value;

    let tmp = {   cessionSource, documentDeSortie,arrondissement };
    let dataPost = { ...dossier, ...tmp };


    this.entetePVService.creer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
      SycadUtils.notifyRemoteInfo("Attribution ajoutée avec succès", this._snackBar);
      this.router.navigate([environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_PV_ATTRIBUTION]);
    },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }


  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_PV_ATTRIBUTION}`]);
  }

  // Méthode pour réinitialiser les tabs 
//resetTabs() { this.stepper.selectedIndex = 0; this.formulaire.reset(); }

resetTabs() { this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_PV_ATTRIBUTION}`]); }

navigateToPreviousTab(): void {
  if (this.selectedIndex > 0) {
    this.selectedIndex--;
  }
}

navigateToNextTab(): void {
  if (this.selectedIndex < this.stepper._tabs.length - 1) {
    this.selectedIndex++;
  }
}



  
}
