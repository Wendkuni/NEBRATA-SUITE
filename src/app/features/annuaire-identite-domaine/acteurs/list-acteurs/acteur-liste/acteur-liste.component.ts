import {
  Compiler,
  Component, Injector,
  Input, NgModuleFactory,
  OnInit,
  ViewChild, ViewContainerRef
} from '@angular/core';
import {
  FlexModule,
  MediaObserver
} from "@angular/flex-layout";
import {
  AbstractSycadTableComponent
} from "@sycadApp/libs/sycad-table/sycad-table-abstract.component";
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableContext,
  SycadTableMetaData, TypeColonne
} from "@sycadApp/libs/model-table";
import {
  AgentItem
} from "@sycadApp/models/data-references/contribuables/agent.model";
import {Subject} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {
  AgentsService
} from "@sycadApp/services/data-references/contribuables/agent.service";
import {
  environment
} from "../../../../../../environments/environment";
import {
  StatsExport
} from "@sycadShared/directives/export.service";
import {
  ActeurItem
} from "@sycadApp/models/data-references/contribuables/acteur.model";
import {
  ActeursService
} from "@sycadApp/services/data-references/contribuables/acteurs.service";

@Component({
  selector: 'app-acteur-liste',
  templateUrl: './acteur-liste.component.html',
  styleUrls: ['./acteur-liste.component.scss']
})
export class ActeurListeComponent extends AbstractSycadTableComponent implements OnInit{
  @Input("acteur")  acteur=new SycadTableContext<ActeurItem>();
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;
  public refeshDataSubject: Subject<string> = new Subject<string>();
  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver,
              private compiler: Compiler,
              private router: Router,
              private injector: Injector,public acteurService: ActeursService)
  {super(); }

  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des acteurs",true,false);
    this.monTableau.isProfil=true;
    this.monTableau
      .pushColumn(new SycadTableColonne("codeUnique","IFU",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("sigle","SIGLE",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("denomination","Dénomination",true,TypeColonne.STRING,true,""))

      .pushColumn(new SycadTableColonne("categorie","Catégorie d'acteurs",true,TypeColonne.STRING,true,""))

      .pushColumn(new SycadTableColonne("statusJuridique","Statut Juridique",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("activitePrincipale","Activité Principale",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("pieceOfficielle.categorie.libelle","Catégorie pièce",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("pieceOfficielle.numero","Numéro Pièce",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("pieceOfficielle.dateObtention","Date Pièce",true,TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("telephones.value","Téléphone principal",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("emails[0].value","Email principal",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("adresses[0].value","Adresse principal",true,TypeColonne.STRING,true,""))

      .pushColumn(new SycadTableColonne("username","Compte Utilisateur",true,TypeColonne.STRING,true,""))
      // .pushColumn(new SycadTableColonne("fonction","Fonction",true,TypeColonne.STRING,true,""))

    this.monTableau.typeRessource="ActeurResource";
    this.monTableau.isExport=true;




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
    tableauComponent.instance.backendApiService=this.acteurService;
    tableauComponent.instance.onEditData.subscribe($event =>  this.modifier($event));
    tableauComponent.instance.onViewProfil.subscribe($event =>  this.onViewProfil($event));
    tableauComponent.instance.onDeleteData.subscribe($event =>  this.supprimer($event));
    tableauComponent.instance.onAddData.subscribe($event =>  this.ajout());
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;
  }

  public ajout() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_ACTEUR}/edition`]);
  }
  public modifier(agent) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_ACTEUR}/edition`,agent.guid]);
  }
  public supprimer(data) {


    this.acteurService.delete(data.guid).subscribe(
      data => {
        this.openSnackBar("Agent supprimé avec succès","OK");

      },
      errorResponse => {
        this.openSnackBar("Impossible de supprimer le contribuable agent","OK");
      }
    );
  }

  public onViewProfil(acteur) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_VIEW_PROFIL_AGENT}`,acteur.guid]);
  }



  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: 'top'

    });
  }

  public genericAction(context: GenericActionEvent) {
  }
  public finishExport(event: StatsExport) {
    this._snackBar.open(`Export agent terminé. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }

}
