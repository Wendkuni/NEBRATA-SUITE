import {
  Compiler,
  Component,
  Injector,
  NgModuleFactory,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {Subject} from 'rxjs';
import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MediaObserver} from '@angular/flex-layout';
import {Router} from '@angular/router';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {MatDialog} from '@angular/material/dialog';
import {
  ActionProcessusEvent,
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import {StatsExport} from '@sycadShared/directives/export.service';
import { AttributionParcelle } from '@sycadApp/models/workflow/sd-attribution.model';
import { environment } from 'environments/environment';
import {SdDemandeDocumentService} from '@sycadApp/services/workflow/sd-demande-document.service';
import { DemandeDocument } from '@sycadApp/models/workflow/sd-demande-document.model';


@Component({
  selector: 'app-plan-cadastral-sd-demande-document',
  templateUrl: './sd-demande-document.component.html',
  styleUrls: ['./sd-demande-document.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SdDemandeDocument extends AbstractSycadTableComponent  implements OnInit {


  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();
  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor( private _snackBar: MatSnackBar,
               private mediaObserver: MediaObserver,
               private router: Router,
               public confirmService: AppConfirmService,
               public dialog: MatDialog,private compiler: Compiler,
               private injector: Injector, public planCadastralService: SdDemandeDocumentService)
  { super();}

  ngOnInit(): void {


    this.monTableau=new SycadTableMetaData("Tableau des demandes de documents",true,false);
    this.monTableau
    .pushColumn(new SycadTableColonne("numero","Numéro",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("objet","Objet",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuableBeneficiaire.codeUnique","IFU-Code",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("parcelle.icad","Parcelle",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("transmission.transmission","Localisation dossier",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("etat","Processus",true,TypeColonne.STRING,true,""))

    .pushColumn(new SycadTableColonne("contribuableBeneficiaire.nom","Nom",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuableBeneficiaire.prenoms","Prénoms",true,TypeColonne.STRING,true,""))
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
    .pushColumn(new SycadTableColonne("structureBeneficiaire.nom","Structure bénéficiaire",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("dateCreationDossier","Date de création",true,TypeColonne.DATETIME,true,""))
    .pushColumn(new SycadTableColonne("dateModificationDossier","Date de modification",true,TypeColonne.DATETIME,true,""))
    .pushColumn(new SycadTableColonne("documentDeSortie.pieceJointe","Document de sortie",true,TypeColonne.LIEN,false,""))
    .pushColumn(new SycadTableColonne("numeroDBT","Numéro DBT",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("dateDBT","Date DBT",true,TypeColonne.DATETIME,true,""))
    .pushColumn(new SycadTableColonne("numeroPVEvaluation","Numéro PVE",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("dateEvaluation","Date d'évaluation",true,TypeColonne.DATETIME,true,""))
    .pushColumn(new SycadTableColonne("valeurInvestissement","Valeur Investissment",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("acteurExterne.denomination","Acteur",true,TypeColonne.STRING,true,""))

      .pushColumn(new SycadTableColonne("refExterne","Référence externe",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("transmissionCreateur.transmission","Localisation créateur dossier",false,TypeColonne.STRING,true,""))

      .pushColumn(new SycadTableColonne("dateExterne","Date externe",false,TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("dateMajPlan","Date Mise à jour",false,TypeColonne.DATE,true,""));


      this.monTableau.typeRessource="DossierSaisieDemandeDocumentResource";
      this.monTableau.isExport=true;

    this.monTableau.transformeToProcessus();


    this.loadComponent();
  }

  public async loadComponent() {
    this.componentFactories = [];
    const { SycadTableComponent,SycadTableModule } = await import('@sycadApp/libs/sycad-table/sycad-table.component');
    const moduleFactory = SycadTableModule instanceof NgModuleFactory ? SycadTableModule
      : (await this.compiler.compileModuleAsync(SycadTableModule));
    const moduleRef = moduleFactory.create(this.injector);
    const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(SycadTableComponent);
    this.anchor.clear();
    const tableauComponent = this.anchor.createComponent(componentFactory);
    tableauComponent.instance.tableDescription=this.monTableau;
    tableauComponent.instance.backendApiService=this.planCadastralService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onAddData.subscribe($event =>  this.actionProcessus(new ActionProcessusEvent(null,null)));
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.onActionProcessu.subscribe($event =>  this.actionProcessus($event));
    tableauComponent.instance.onPreviewData.subscribe($event =>  this.vueAttribution($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;
  }
  public finishExport(event: StatsExport) {
    this._snackBar.open(`Export attribution terminé. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }
  public actionProcessus(context: ActionProcessusEvent) {
    if(context.numero){
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DEMANDE_DOCUMENT}/edition`, context.numero,context.transition.code],{
        state: {
          context
        }
      });
    }else {
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DEMANDE_DOCUMENT}/edition`]);

    }

  }

  public vueAttribution(dossier: DemandeDocument){
     this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DEMANDE_DOCUMENT}/view`, dossier.numero]);
   }

  public genericAction(context: GenericActionEvent) {
   // console.log("une action quelconque  ",context)
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top'

    });
  }
}
