import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {TransitionPlanCadastralFusionnement} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-fusion/edition-plan-cadastral-fusion/transition-fusion.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import {
  FormArray,
  FormBuilder,
  Validators
} from '@angular/forms';
import {CategoriePieceService} from '@sycadApp/services/data-references/system/categorie-piece.service';
import {PlanCadastralFusionnementService} from '@sycadApp/services/workflow/common/fusionnement.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import {ContribuableService} from '@sycadApp/services/data-references/system/contribuable.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {MandatService} from '@sycadApp/services/workflow/mandat.service';
import {environment} from '../../../../../../environments/environment';
import {SycadUtils} from '@sycadShared/utils.functions';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-approuver-travail-fusion',
  templateUrl: './approuver-travail-fusion.component.html',
  styleUrls: ['./approuver-travail-fusion.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ApprouverTravailFusionComponent extends TransitionPlanCadastralFusionnement implements OnInit {
  public displayedColumnsParcelle: string[] = ['icad','numero', 'libelle', 'etatMev','destination','superficie','etatAttribution','numeroIlot','arrondissement','commune','localite'];
  public dataSourceParcelles = new MatTableDataSource();

  constructor(public dialog: MatDialog,
              public router: Router,
              public _snackBar: MatSnackBar,
              public confirmService: AppConfirmService,
              public _adapter: DateAdapter<any>,
              public mediaObserver: MediaObserver,
              public fb: FormBuilder,
              public categoriePieceService: CategoriePieceService,
              public fusionService: PlanCadastralFusionnementService,
              public acteurService: ActeursService,
              public contribuableService: ContribuableService,
              public structureService: StructureService,
              public parcelleService: ParcelleService, public mandatService: MandatService)
  {
    super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService, fusionService,
      acteurService, contribuableService, structureService, parcelleService, mandatService);
      this.formulaire = this.fb.group({
        numero: [null, [Validators.required]],
        action: [null, [Validators.required]],
        parcelles: [null, [Validators.required]],
        parcelle: [null,  [Validators.required]],
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
    this._adapter.setLocale('fr');
    this.parcellesChoisies = [this.fusion.parcelle];

    this.formulaire.patchValue({
      numero: this.fusion.numero,
      action: this.transition.code,
      parcelles: this.fusion?.parcelles?.map(parcelle => parcelle?.id),
      parcelle: this.fusion?.parcelle.id
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
    });
    this.dataSourceParcelles.data=this.fusion.parcelles;
  }
  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }

    this.loadingEvent.emit(true);

    let {  action, numero, parcelles,parcelle } = this.formulaire.value;
    let {observation}=this.formulaire.value.dossier;
    let dossier = { action, numero,observation, parcelles,parcelle} ;

    this.fusionService.executer(dossier).subscribe(data => {
        this.loadingEvent.emit(false);
        this.openSnackBar('Dossier de fusionnement modifié avec succès', 'OK');
        this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_FUSION]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }
  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_FUSION}`]);
  }
}
