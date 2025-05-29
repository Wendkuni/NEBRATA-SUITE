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
  ActeurItem
} from "@sycadApp/models/data-references/contribuables/acteur.model";
import {Subject} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {
  ActeursService
} from "@sycadApp/services/data-references/contribuables/acteurs.service";
import {
  environment
} from "../../../../../environments/environment";
import {
  StatsExport
} from "@sycadShared/directives/export.service";
import {
  ContribuablePhysiqueItem
} from "@sycadApp/models/data-references/contribuables/contribuable-physique.model";
import {
  ContribuablePhysiqueService
} from "@sycadApp/services/data-references/contribuables/contribuable-physique.service";

@Component({
  selector: 'app-liste-contribuable-physique',
  templateUrl: './liste-contribuable-physique.component.html',
  styleUrls: ['./liste-contribuable-physique.component.scss']
})
export class ListeContribuablePhysiqueComponent extends AbstractSycadTableComponent implements OnInit{
  @Input("contribuable")  contribuable=new SycadTableContext<ContribuablePhysiqueItem>();
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
              private injector: Injector,public contribuablePhysiqueService: ContribuablePhysiqueService)
  {super(); }

  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des contribuables physiques",true,false);
    this.monTableau.isProfil=true;
    this.monTableau


      .pushColumn(new SycadTableColonne("nom","Nom",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("prenoms","Prénom",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("genre","Genre",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("situationMatrimoniale","Situation matrimoniale",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("telephones[0].value","Téléphone principal",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("emails[0].value","Email principal",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("dateNaissance","Date de Naissance",true,TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("lieuNaissance","Lieu de Naissance",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("pieceOfficielle.nip","NIP",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("pieceOfficielle.categorie.libelle","Catégorie Pièce",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("pieceOfficielle.numero","Numéro Pièce",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("pieceOfficielle.dateObtention","Date Pièce",true,TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("profession","Profession",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("nomPere","Nom Père",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("nomMere","Nom Mère",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("username","Compte utilisateur",true,TypeColonne.STRING,true,""))

    // .pushColumn(new SycadTableColonne("fonction","Fonction",true,TypeColonne.STRING,true,""))

    this.monTableau.typeRessource="ContribuablePhysiqueResource";
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
    tableauComponent.instance.backendApiService=this.contribuablePhysiqueService;
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
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_PHYSIQUE}/edition`]);
  }
  public modifier(contribuale) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_PHYSIQUE}/edition`,contribuale.guid]);
  }
  public supprimer(data) {


    this.contribuablePhysiqueService.delete(data.guid).subscribe(
      data => {
        this.openSnackBar("Agent supprimé avec succès","OK");

      },
      errorResponse => {
        this.openSnackBar("Impossible de supprimer le contribuable agent","OK");
      }
    );
  }

  public onViewProfil(contribuale) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_VIEW_PROFIL_PHYSIQUE}`,contribuale.guid]);
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
