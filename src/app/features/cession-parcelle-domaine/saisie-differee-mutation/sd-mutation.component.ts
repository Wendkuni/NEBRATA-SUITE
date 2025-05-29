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
import { SdMutationService } from '@sycadApp/services/workflow/sd-mutation.service';
import { MutationParcelle } from '@sycadApp/models/workflow/sd-mutation.model';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-plan-cadastral-sd-attribution',
  templateUrl: './sd-mutation.component.html',
  styleUrls: ['./sd-mutation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SdMutationComponent extends AbstractSycadTableComponent  implements OnInit {


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
               private injector: Injector, public planCadastralService: SdMutationService)
  { super();}

  ngOnInit(): void {


    this.monTableau=new SycadTableMetaData("Tableau des dossiers de mutation",true,false);
    this.monTableau
    .pushColumn(new SycadTableColonne("numero","Numero",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("objet","Objet",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("cedant.codeUnique","IFU-Code",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("parcelle.icad","Parcelle",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("etat","Processus",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("transmission.transmission","Localisation dossier",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("dateCreationDossier","Date de création",true,TypeColonne.DATETIME,true,""))
    .pushColumn(new SycadTableColonne("dateModificationDossier","Date de modification",true,TypeColonne.DATETIME,true,""))

    .pushColumn(new SycadTableColonne("parcelle.arrondissement.nom","Arrondissement",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("parcelle.arrondissement.commune.nom","Commune",true,TypeColonne.STRING,true,""))

      .pushColumn(new SycadTableColonne("cessionnaire.libelle","Cessionnaire",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("cedant.nom","Nom",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("cedant.prenoms","Prenom",true,TypeColonne.STRING,true,""))

      .pushColumn(new SycadTableColonne("cedant.lieuNaissance","Lieu de naissance",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("cedant.dateNaissance","Date de naissance",true,TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("cedant.pieceOfficielle.categorie.libelle","Type de pièce",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("cedant.pieceOfficielle.numero","N° Pièce",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("cedant.pieceOfficielle.nip","NIP",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("cedant.pieceOfficielle.dateObtention","Date de la pièce",true,TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("cedant.activitePrincipale","Activité principale",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("cedant.denomination","Dénomination",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("cedant.sigle","Sigle",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("cedant.numCNSS","N° CNSS",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("cedant.nomPere","Nom du père ",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("cedant.prenomsPere","Prenom du père",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("cedant.nomMere","Nom de la mère",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("cedant.prenomsMere","Prenom de la mère",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("cedant.profession","Profession",true,TypeColonne.STRING,true,""))

      .pushColumn(new SycadTableColonne("cessionSource.libelle","Cession source",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("acteur.denomination","Acteur",true,TypeColonne.STRING,true,""))

      .pushColumn(new SycadTableColonne("refExterne","Référence externe",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("transmissionCreateur.transmission","Localisation créateur dossier",false,TypeColonne.STRING,true,""))

      .pushColumn(new SycadTableColonne("valeurDeclare","Valeur déclarée",false,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("bordereau","Bordereau",false,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("folio","Folio",false,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("droit","Droit",false,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("caseDoc","Case document",false,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("numeroQuittance","Numéro de la quittance",false,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("dateQuittance","Date quittance",false,TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("enregistrement","Date d'enregistrement",false,TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("dateExterne","Date externe",false,TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("dateMajPlan","Date Mise à jour",false,TypeColonne.DATE,true,""));

      this.monTableau.typeRessource="DossierSaisieMutationResource";
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
    tableauComponent.instance.onPreviewData.subscribe($event =>  this.vueMutation($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;
  }
  public finishExport(event: StatsExport) {
    this._snackBar.open(`Export mutation terminé. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }
  public actionProcessus(context: ActionProcessusEvent) {
    if(context.numero){
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_MUTATION}/edition`, context.numero,context.transition.code],{
        state: {
          context
        }
      });
    }else {
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_MUTATION}/edition`]);

    }

  }

  public vueMutation(mutation: MutationParcelle){
     this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_MUTATION}/view`, mutation.numero]);
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
