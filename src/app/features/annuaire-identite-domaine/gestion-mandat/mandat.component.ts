import { Compiler, Component, Injector, NgModuleFactory, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ActionProcessusEvent, SycadTableMetaData, SycadTableColonne, TypeColonne, GenericAction, GenericActionEvent } from '@sycadApp/libs/model-table';
import { AbstractSycadTableComponent } from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import { MandatElement } from '@sycadApp/models/workflow/common/general';
import { AttributionParcelle } from '@sycadApp/models/workflow/sd-attribution.model';
import { MandatsService } from '@sycadApp/services/workflow/mandats.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { StatsExport } from '@sycadApp/shared/directives/export.service';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-mandat',
  templateUrl: './mandat.component.html',
  styleUrls: ['./mandat.component.scss']
})
export class MandatComponent extends AbstractSycadTableComponent   implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();
  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver,
              private router: Router,
              public confirmService: AppConfirmService,
              public dialog: MatDialog,private compiler: Compiler,
              private injector: Injector, public planCadastralService: MandatsService) { super();}


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
    tableauComponent.instance.onPreviewData.subscribe($event =>  this.vueMandat($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;
  }
  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des dossiers de mandat",true,false);
    this.monTableau.typeRessource="DossierMandatResource";
    this.monTableau.isExport=true;

    this.monTableau.transformeToProcessus();

    this.monTableau
      .pushColumn(new SycadTableColonne("objet","Objet",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("dateCreationDossier","Date de création",true,TypeColonne.DATETIME,true,""))
      .pushColumn(new SycadTableColonne("dateModificationDossier","Date de modification",true,TypeColonne.DATETIME,true,""))
      .pushColumn(new SycadTableColonne("numero","Numéro",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("mandat.mandataire.nom","Nom",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("mandat.mandataire.prenoms","Prenom",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("mandat.mandataire.codeUnique","IFU-Code",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("mandat.mandataire.lieuNaissance","Lieu de naissance",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("mandat.mandataire.dateNaissance","Date de naissance",true,TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("mandat.mandataire.pieceOfficielle.categorie.libelle","Type de pièce",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("mandat.mandataire.pieceOfficielle.numero","N° Pièce",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("mandat.mandataire.pieceOfficielle.nip","NIP",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("mandat.mandataire.pieceOfficielle.dateObtention","Date de la pièce",true,TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("mandat.mandataire.activitePrincipale","Activité principale",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("mandat.mandataire.denomination","Dénomination",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("mandat.mandataire.sigle","Sigle",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("mandat.mandataire.numCNSS","N° CNSS",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("mandat.mandataire.nomPere","Nom du père ",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("mandat.mandataire.prenomsPere","Prenom du père",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("mandat.mandataire.nomMere","Nom de la mère",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("mandat.mandataire.prenomsMere","Prenom de la mère",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("mandat.mandataire.profession.nom","Profession",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("mandat.mandant.libelle","Mandant",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("etat","Etat processus du dossier",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("etatDossier","Etat du dossier",false,TypeColonne.BOOLEAN,true,""))
      .pushColumn(new SycadTableColonne("refExterne","Référence externe",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("transmissionCreateur.transmission","Localisation créateur dossier",false,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("transmission.transmission","Localisation dossier",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("debut","Date de début",false,TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("fin","Date de fin",false,TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("dateExterne","Date externe",false,TypeColonne.DATE,true,""))

    this.loadComponent();



  }
  public finishExport(event: StatsExport) {
    this._snackBar.open(`Export attribution terminé. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }
  public actionProcessus(context: ActionProcessusEvent) {
    if(context.numero){
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_MANDAT}/edition`, context.numero,context.transition.code],{
        state: {
          context
        }
      });
    }else {
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_MANDAT}/edition`]);

    }

  }

  public vueMandat(mandat: MandatElement){
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_MANDAT}/view`, mandat.numero]);
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
