import { NgModuleFactory, ViewEncapsulation } from '@angular/core';
import { Compiler, Component, Injector, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';
import { SycadTableMetaData, SycadTableColonne, TypeColonne, GenericAction, ActionProcessusEvent, GenericActionEvent } from '@sycadApp/libs/model-table';
import { AbstractSycadTableComponent } from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import { PlanCadastralFusionementElement } from '@sycadApp/models/workflow/cp-fusionnement.model';
import { BornageDelimitationService } from '@sycadApp/services/bornage/bornage-delimitation.service';
import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { StatsExport } from '@sycadApp/shared/directives/export.service';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-bornage-delimitation',
  templateUrl: './bornage-delimitation.component.html',
  styleUrls: ['./bornage-delimitation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BornageDelimitationComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild('datatable1', { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public authentificatedUser: AuthentificatedUser;

  public refeshDataSubject: Subject<string> = new Subject<string>();
  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(private _snackBar: MatSnackBar,
    private mediaObserver: MediaObserver,
    public authService: AuthenticationService,
    private router: Router,
    public confirmService: AppConfirmService,
    public dialog: MatDialog, private compiler: Compiler,
    private injector: Injector,public bornageDelimitationService: BornageDelimitationService) {
    super();
  }

  ngOnInit(): void {


    this.authService.getMe().subscribe((ob) => {
      this.authentificatedUser=ob;
     //// console.log('authentificatedUser',this.authentificatedUser)
     });

    this.monTableau=new SycadTableMetaData("Tableau des dossiers de bornage délimitation",true,false);
    this.monTableau
    .pushColumn(new SycadTableColonne("numero","Numéro",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("etat","Processus",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("objet","Objet",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuableBeneficiaire.codeUnique","IFU-Code",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("parcelle.icad","Parcelle",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("transmission.transmission","Localisation dossier",true,TypeColonne.STRING,true,""))

    .pushColumn(new SycadTableColonne("etatDossier","Actif ?",true,TypeColonne.BOOLEAN,true,""))
    .pushColumn(new SycadTableColonne("demandeRequisition","Demande réquisition",true,TypeColonne.LIEN,true,""))
    .pushColumn(new SycadTableColonne("pvBornage","PV de bornage",true,TypeColonne.LIEN,true,""))
    .pushColumn(new SycadTableColonne("dateCreationDossier","Date dossier",true,TypeColonne.DATE,true,""))
    .pushColumn(new SycadTableColonne("numeroBornage","Numéro bornage",true,TypeColonne.STRING,true,""))

    .pushColumn(new SycadTableColonne("contribuableBeneficiaire.nom","Nom ",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuableBeneficiaire.prenoms","Prenom",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("structureBeneficiaire.nom","Structure bénéficiaire",true,TypeColonne.STRING,true,""))
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

    .pushColumn(new SycadTableColonne("acteurExterne.denomination","Acteur",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("avisFraisImpot","Avis de frais",true,TypeColonne.LIEN,true,""))


    .pushColumn(new SycadTableColonne("refExterne","Référence externe",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("transmissionCreateur.transmission","Localisation créateur dossier",false,TypeColonne.STRING,true,""))


    .pushColumn(new SycadTableColonne("dateExterne","Date externe",false,TypeColonne.DATE,true,""))
    .pushColumn(new SycadTableColonne("dateMajPlan","Date Mise à jour",false,TypeColonne.DATE,true,""));


    this.monTableau.typeRessource="DossierBornageResource";
    this.monTableau.isExport=true;

    this.monTableau.transformeToProcessus();



    this.loadComponent();
  }
  public async loadComponent() {
    this.componentFactories = [];
    const { SycadTableComponent, SycadTableModule } = await import('@sycadApp/libs/sycad-table/sycad-table.component');
    const moduleFactory = SycadTableModule instanceof NgModuleFactory ? SycadTableModule
      : (await this.compiler.compileModuleAsync(SycadTableModule));
    const moduleRef = moduleFactory.create(this.injector);
    const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(SycadTableComponent);
    this.anchor.clear();
    const tableauComponent = this.anchor.createComponent(componentFactory);
    tableauComponent.instance.tableDescription = this.monTableau;
    tableauComponent.instance.backendApiService = this.bornageDelimitationService;
    tableauComponent.instance.actions = this.actions;
    tableauComponent.instance.onAddData.subscribe($event =>  this.actionProcessus(new ActionProcessusEvent(null, null)));
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.onActionProcessu.subscribe($event =>  this.actionProcessus($event));
    tableauComponent.instance.onPreviewData.subscribe($event =>  this.vueFusion($event));
    tableauComponent.instance.refeshDataSubject = this.refeshDataSubject;
  }
  public finishExport(event: StatsExport) {
    this._snackBar.open
    (`Export Plan cadastral lotissement  terminé. Fichier : ${event.fileName},
    Taille: ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }
  public actionProcessus(context: ActionProcessusEvent) {
    if (context.numero) {
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_BORNAGE_DELIMITATION}/edition`,
        context.numero, context.transition.code],
        {state: {
          context
        }
      });
    } else {
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_BORNAGE_DELIMITATION}/edition`]);
    }


  }
  public vueFusion(bornageDelimitation: PlanCadastralFusionementElement){
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_BORNAGE_DELIMITATION}/view`, bornageDelimitation.numero]);
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
