import {
  Compiler,
  Component, Injector, NgModuleFactory,
  OnInit, ViewChild, ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import {AuthentificatedUser} from '@sycadApp/features/transverse/login/auth.user';
import {Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MediaObserver} from '@angular/flex-layout';
import {AuthenticationService} from '@sycadApp/features/transverse/login/authentication.service';
import {Router} from '@angular/router';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {MatDialog} from '@angular/material/dialog';
import {PlanCadastralMorcellementService} from '@sycadApp/services/workflow/common/morcellement.service';
import {
  ActionProcessusEvent,
  GenericAction, GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData, TypeColonne
} from '@sycadApp/libs/model-table';
import {StatsExport} from '@sycadShared/directives/export.service';
import {environment} from '../../../../environments/environment';
import {PlanCadastralFusionementElement} from '@sycadApp/models/workflow/cp-fusionnement.model';
import {PlanCadastralMorcellementElement} from '@sycadApp/models/workflow/cp-morcellement.model';

@Component({
  selector: 'app-domaine-morcellement',
  templateUrl: './domaine-morcellement.component.html',
  styleUrls: ['./domaine-morcellement.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DomaineMorcellementComponent extends  AbstractSycadTableComponent  implements OnInit {
  @ViewChild('datatable1', {read: ViewContainerRef})
  private anchor: ViewContainerRef;

  public authentificatedUser: AuthentificatedUser;

  public refeshDataSubject: Subject<string> = new Subject<string>();

  public getAnchor(): ViewContainerRef {
    return this.anchor;
  }

  constructor(private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver,
              public authService: AuthenticationService,
              private router: Router,
              public confirmService: AppConfirmService,
              public dialog: MatDialog, private compiler: Compiler,
              private injector: Injector, public morcellementService: PlanCadastralMorcellementService) {
    super();
  }

  ngOnInit(): void {


    this.authService.getMe().subscribe((ob) => {
      this.authentificatedUser = ob;
    });

    this.monTableau = new SycadTableMetaData("Tableau des dossiers de morcellement des parcelles", true, false);
    this.monTableau
      .pushColumn(new SycadTableColonne("numero", "Numéro", true, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("objet", "Objet", true, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("contribuableBeneficiaire.codeUnique","IFU-Code",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("parcelle.icad", "Parcelle", true, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("etat", "Processus", true, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("etatDossier", "Actif ?", true, TypeColonne.BOOLEAN, true, ""))
      .pushColumn(new SycadTableColonne("avisFraisImpot","Avis de frais",true,TypeColonne.LIEN,true,""))
      .pushColumn(new SycadTableColonne("transmission.transmission", "Localisation dossier", true, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("contribuableBeneficiaire.nom","Nom",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("contribuableBeneficiaire.prenoms","Prenom",true,TypeColonne.STRING,true,""))

      .pushColumn(new SycadTableColonne("contribuableBeneficiaire.lieuNaissance","Lieu de naissance",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("contribuableBeneficiaire.dateNaissance","Date de naissance",true,TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("contribuableBeneficiaire.pieceOfficielle.categorie.libelle","Type de pièce",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("contribuableBeneficiaire.pieceOfficielle.numero","N° Pièce",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("contribuableBeneficiaire.pieceOfficielle.nip","NIP",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("contribuableBeneficiaire.pieceOfficielle.dateObtention","Date de la pièce",true,TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("contribuableBeneficiaire.activitePrincipale","Activité principale",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("contribuableBeneficiaire.denomination","Dénomination",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("contribuableBeneficiaire.sigle","Sigle",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("contribuableBeneficiaire.numCNSS","N° CNSS",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("contribuableBeneficiaire.nomPere","Nom du père ",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("contribuableBeneficiaire.prenomsPere","Prenom du père",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("contribuableBeneficiaire.nomMere","Nom de la mère",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("contribuableBeneficiaire.prenomsMere","Prenom de la mère",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("contribuableBeneficiaire.profession","Profession",true,TypeColonne.STRING,true,""))

      .pushColumn(new SycadTableColonne("structureBeneficiaire.nom", "Structure bénéficiaire", true, TypeColonne.STRING, true, ""))

      .pushColumn(new SycadTableColonne("acteurExterne.denomination", "Acteur", true, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("demandeRequisition", "Demande réquisition", true, TypeColonne.LIEN, true, ""))
      .pushColumn(new SycadTableColonne("refExterne", "Référence externe", true, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("transmissionCreateur.transmission", "Localisation créateur dossier", false, TypeColonne.STRING, true, ""))

      .pushColumn(new SycadTableColonne("dateExterne", "Date externe", false, TypeColonne.DATE, true, ""))
      .pushColumn(new SycadTableColonne("dateMajPlan", "Date Mise à jour", false, TypeColonne.DATE, true, ""))
      .pushColumn(new SycadTableColonne("dateCreationDossier", "Date de création", true, TypeColonne.DATETIME, true, ""))
      .pushColumn(new SycadTableColonne("dateModificationDossier","Date de modification",true,TypeColonne.DATETIME,true,""));

      this.monTableau.typeRessource="DossierMorcellementResource";
      this.monTableau.isExport=true;

    this.monTableau.transformeToProcessus();

  //  this.actions.push(new GenericAction("action1", "Action multiple 1"));
 //   this.actions.push(new GenericAction("action2", "Action multiple 2"));
 //   this.actions.push(new GenericAction("action3", "Action multiple 3"));

    this.loadComponent();
  }

  public async loadComponent() {
    this.componentFactories = [];
    const {SycadTableComponent, SycadTableModule} = await import('@sycadApp/libs/sycad-table/sycad-table.component');
    const moduleFactory = SycadTableModule instanceof NgModuleFactory ? SycadTableModule
      : (await this.compiler.compileModuleAsync(SycadTableModule));
    const moduleRef = moduleFactory.create(this.injector);
    const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(SycadTableComponent);
    this.anchor.clear();
    const tableauComponent = this.anchor.createComponent(componentFactory);
    tableauComponent.instance.tableDescription = this.monTableau;
    tableauComponent.instance.backendApiService = this.morcellementService;
    tableauComponent.instance.actions = this.actions;
    tableauComponent.instance.onAddData.subscribe($event => this.actionProcessus(new ActionProcessusEvent(null, null)));
    tableauComponent.instance.onGenericAction.subscribe($event => this.genericAction($event));
    tableauComponent.instance.onFinishExport.subscribe($event => this.finishExport($event));
    tableauComponent.instance.onActionProcessu.subscribe($event => this.actionProcessus($event));
    tableauComponent.instance.onPreviewData.subscribe($event => this.vueMorcellement($event));
    tableauComponent.instance.refeshDataSubject = this.refeshDataSubject;
  }

  public finishExport(event: StatsExport) {
    this._snackBar.open
    (`Export Plan cadastral morcellement terminé. Fichier : ${event.fileName},
    Taille: ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }

  public actionProcessus(context: ActionProcessusEvent) {
    if (context.numero) {
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MORCELLEMENT}/edition`,
          context.numero, context.transition.code],
        {
          state: {
            context
          }
        });
    } else {
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MORCELLEMENT}/edition`]);
    }
  }
  public vueMorcellement(morcellement: PlanCadastralMorcellementElement){
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MORCELLEMENT}/view`, morcellement.numero]);
  }

  public genericAction(context: GenericActionEvent) {
   // console.log('une action quelconque ', context)
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: 'top'

    });
  }
}
