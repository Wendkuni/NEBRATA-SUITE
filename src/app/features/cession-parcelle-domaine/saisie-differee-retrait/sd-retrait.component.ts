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
import { RetraitParcelle } from '@sycadApp/models/workflow/sd-retrait.model';
import { SdRetraitService } from '@sycadApp/services/workflow/sd-retrait.service';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-plan-cadastral-sd-retrait',
  templateUrl: './sd-retrait.component.html',
  styleUrls: ['./sd-retrait.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SdRetraitComponent extends AbstractSycadTableComponent  implements OnInit {


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
               private injector: Injector, public planCadastralService: SdRetraitService)
  { super();}

  ngOnInit(): void {


    this.monTableau=new SycadTableMetaData("Tableau des dossiers de retrait",true,false);
    this.monTableau
    .pushColumn(new SycadTableColonne("numero","Numero",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("objet","Objet",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("ancienAttributaire.codeUnique","IFU-Code",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("parcelle.icad","Parcelle",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("transmission.transmission","Localisation dossier",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("etat","Processus",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("dateCreationDossier","Date de création",true,TypeColonne.DATETIME,true,""))
    .pushColumn(new SycadTableColonne("dateModificationDossier","Date de modification",true,TypeColonne.DATETIME,true,""))

    .pushColumn(new SycadTableColonne("parcelle.arrondissement.nom","Arrondissement",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("parcelle.arrondissement.commune.nom","Commune",true,TypeColonne.STRING,true,""))

      .pushColumn(new SycadTableColonne("structure.nom","Structure",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("ancienAttributaire.nom","Nom",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("ancienAttributaire.prenoms","Prenom",true,TypeColonne.STRING,true,""))

      .pushColumn(new SycadTableColonne("ancienAttributaire.lieuNaissance","Lieu de naissance",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("ancienAttributaire.dateNaissance","Date de naissance",true,TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("ancienAttributaire.pieceOfficielle.categorie.libelle","Type de pièce",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("ancienAttributaire.pieceOfficielle.numero","N° Pièce",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("ancienAttributaire.pieceOfficielle.nip","NIP",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("ancienAttributaire.pieceOfficielle.dateObtention","Date de la pièce",true,TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("ancienAttributaire.activitePrincipale","Activité principale",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("ancienAttributaire.denomination","Dénomination",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("ancienAttributaire.sigle","Sigle",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("ancienAttributaire.numCNSS","N° CNSS",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("ancienAttributaire.nomPere","Nom du père ",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("ancienAttributaire.prenomsPere","Prenom du père",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("ancienAttributaire.nomMere","Nom de la mère",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("ancienAttributaire.prenomsMere","Prenom de la mère",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("ancienAttributaire.profession","Profession",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("cessionSource.libelle","Cession source",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("acteur.denomination","Acteur",true,TypeColonne.STRING,true,""))

      .pushColumn(new SycadTableColonne("refExterne","Référence externe",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("transmissionCreateur.transmission","Localisation créateur dossier",false,TypeColonne.STRING,true,""))


      .pushColumn(new SycadTableColonne("dateExterne","Date externe",false,TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("dateMajPlan","Date Mise à jour",false,TypeColonne.DATE,true,""));

      this.monTableau.typeRessource="DossierSaisieRetraitResource";
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
    tableauComponent.instance.tableDescription=this.monTableau;
    tableauComponent.instance.backendApiService=this.planCadastralService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onAddData.subscribe($event =>  this.actionProcessus(new ActionProcessusEvent(null,null)));
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.onActionProcessu.subscribe($event =>  this.actionProcessus($event));
    tableauComponent.instance.onPreviewData.subscribe($event =>  this.vueRetrait($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;
  }
  public finishExport(event: StatsExport) {
    this._snackBar.open(`Export retrait terminé. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }
  public actionProcessus(context: ActionProcessusEvent) {
    if(context.numero){
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_RETRAIT}/edition`, context.numero,context.transition.code],{
        state: {
          context
        }
      });
    }else {
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_RETRAIT}/edition`]);

    }

  }

  public vueRetrait(retrait: RetraitParcelle){
     this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_RETRAIT}/view`, retrait.numero]);
   }

  public genericAction(context: GenericActionEvent) {

  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top'

    });
  }
}
