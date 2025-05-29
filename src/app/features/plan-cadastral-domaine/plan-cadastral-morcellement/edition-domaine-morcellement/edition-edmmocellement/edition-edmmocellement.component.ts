import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Processus } from '@sycadApp/models/workflow/common/general';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { ActeursService } from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { StructureService } from '@sycadApp/services/data-references/organigramme/structure.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';
import { PlanCadastralMorcellementService } from '@sycadApp/services/workflow/common/morcellement.service';
import { MandatService } from '@sycadApp/services/workflow/mandat.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { environment } from 'environments/environment';
import { TransitionDomaineMorcellementComponent } from '../transition-domaine-morcellement.component';

@Component({
  selector: 'app-edition-edmmocellement',
  templateUrl: './edition-edmmocellement.component.html',
  styleUrls: ['./edition-edmmocellement.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditionEDMMocellementComponent extends TransitionDomaineMorcellementComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public router: Router,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public categoriePieceService: CategoriePieceService,
    public morcellementService: PlanCadastralMorcellementService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public structureService: StructureService,
    public parcelleService: ParcelleService, public mandatService: MandatService

  ) {
    super(router, dialog, _snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService, morcellementService,
      acteurService, contribuableService, structureService, parcelleService, mandatService)

      this.formulaire = this.fb.group({
        numero: [null, [Validators.required]],
        action: [null, [Validators.required]],
        documents: new FormArray([]),
        dossier : this.fb.group({
          observation: [null]
        }),
      });
  }

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  ngOnInit(): void {
    this._adapter.setLocale("fr");

    if(this.morcellement.documents){
      this.morcellement.documents.map(document =>{
       this.documents.insert(0, this.createDocument(document))
      });
    }
    this.formulaire.patchValue({
      numero: this.morcellement.numero,
      action: this.transition.code
    });
  }
  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }
    this.loadingEvent.emit(true);
    let {  documents, numero,
      action } = this.formulaire.value;
      let tmp = {  documents, action, numero };
      let {observation}=this.formulaire.value.dossier;
    let dataPost = { ...tmp,observation };
    this.morcellementService.executer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
      this.openSnackBar("Exécution effectuée avec succès", "OK");
      this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MORCELLEMENT]);
    },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );

  }
  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MORCELLEMENT}`]);
  }


}
