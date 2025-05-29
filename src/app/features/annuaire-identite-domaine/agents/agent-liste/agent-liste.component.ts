import {
  Compiler,
  Component,
  Injector, Input,
  NgModuleFactory,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import { CategorieImmeubleService } from '@sycadApp/services/data-references/system/categorie-immeuble.service';
import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import {StatsExport} from '@sycadShared/directives/export.service';
import {
  ActionElementEvent,
  GenericActionEvent,
  SycadTableColonne, SycadTableContext,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';

import {
  environment
} from "../../../../../environments/environment";
import {Router} from "@angular/router";
import {
  DomaineFonctionnelService
} from "@sycadApp/services/data-references/system/domaine-fonctionnel.service";
import {
  AgentsService
} from "@sycadApp/services/data-references/contribuables/agent.service";
import {
  AgentElement, AgentItem
} from "@sycadApp/models/data-references/contribuables/agent.model";


@Component({
  selector: 'app-agent-liste',
  templateUrl: './agent-liste.component.html',
  styleUrls: ['./agent-liste.component.scss']
})
export class AgentListeComponent extends AbstractSycadTableComponent implements OnInit{
  @Input("agent")  agent=new SycadTableContext<AgentItem>();
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
              private injector: Injector,public agentService: AgentsService)
  {super(); }

  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des agents",true,false);
    this.monTableau.isProfil=true;
    this.monTableau.isAffectation=true;
    this.monTableau.isCompte=true;
    this.monTableau
      .pushColumn(new SycadTableColonne("codeUnique","Code unique",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("matricule","Matricule",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("username","Compte utilisateur",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("nom","Nom",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("prenoms","Prénom",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("profils","Profil",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("fonction","Fonction",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("affectation.structure.sigle","Structure",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("affectation.service.sigle","Service",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("affectation.bureau.sigle","Bureau",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("affectation.signataire","Signataire",true,TypeColonne.BOOLEAN,true,""))
      .pushColumn(new SycadTableColonne("affectation.interim","Intérim",true,TypeColonne.BOOLEAN,true,""))
      .pushColumn(new SycadTableColonne("profession","Profession",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("pieceOfficielle.nip","NIP",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("pieceOfficielle.categorie.libel                        le","Catégorie Pièce",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("pieceOfficielle.numero","Numéro Pièce",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("pieceOfficielle.dateObtention","Date Pièce",true,TypeColonne.DATE,true,""))
    this.monTableau.typeRessource="AgentResource";
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
    tableauComponent.instance.backendApiService=this.agentService;
    tableauComponent.instance.onEditData.subscribe($event =>  this.modifier($event));
    tableauComponent.instance.onAffectionData.subscribe($event =>  this.onAffectation($event));
    tableauComponent.instance.onGererCompte.subscribe($event =>  this.onGererCompte($event));
    tableauComponent.instance.onViewProfil.subscribe($event =>  this.onViewProfil($event));
    tableauComponent.instance.onDeleteData.subscribe($event =>  this.supprimer($event));
    tableauComponent.instance.onAddData.subscribe($event =>  this.ajout());
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;

  }

  public ajout() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_AGENT}/edition`]);
  }
  public modifier(agent) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_AGENT}/edition`,agent.guid]);
  }
  public supprimer(data) {


    this.agentService.delete(data.guid).subscribe(
      data => {
        this.openSnackBar("Agent supprimé avec succès","OK");

      },
      errorResponse => {
        this.openSnackBar("Impossible de supprimer le contribuable agent","OK");
      }
    );
  }

  public onViewProfil(agent) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_VIEW_PROFIL_AGENT}`,agent.guid]);
  }
  public onAffectation(agent) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_AGENT}/affectation`, agent.guid]);
  }

  public onGererCompte(agent) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_AGENT}/compte`, agent.guid]);
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
