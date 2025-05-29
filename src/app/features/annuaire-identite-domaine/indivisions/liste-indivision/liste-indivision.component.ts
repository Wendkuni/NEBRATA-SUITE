import {
  Compiler,
  Component, Injector,
  Input, NgModuleFactory,
  OnInit,
  ViewChild, ViewContainerRef
} from '@angular/core';
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
  ContribuableMoraleItem
} from "@sycadApp/models/data-references/contribuables/contribuable-moral.model";
import {Subject} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MediaObserver} from "@angular/flex-layout";
import {Router} from "@angular/router";
import {
  ContribuableMoralService
} from "@sycadApp/services/data-references/contribuables/contribuable-moral-service";
import {
  environment
} from "../../../../../environments/environment";
import {
  StatsExport
} from "@sycadShared/directives/export.service";
import {
  IndivisionItem
} from "@sycadApp/models/data-references/contribuables/indivisions.model";
import {
  IndivisionsService
} from "@sycadApp/services/data-references/contribuables/indivisions.service";

@Component({
  selector: 'app-liste-indivision',
  templateUrl: './liste-indivision.component.html',
  styleUrls: ['./liste-indivision.component.scss']
})
export class ListeIndivisionComponent extends AbstractSycadTableComponent implements OnInit{
  @Input("contribuable")  contribuable=new SycadTableContext<IndivisionItem>();
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
              private injector: Injector,public indivisionsService: IndivisionsService)
  {super(); }

  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des indivisions",true,false);
    this.monTableau.isProfil=true;
    this.monTableau
      .pushColumn(new SycadTableColonne("codeUnique","IFU",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("relation","Relation",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("denomination","Dénomination",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("statusJuridique","Forme Juridique",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("pieceOfficielle.categorie.libelle","Catégorie pièce",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("pieceOfficielle.numero","Numéro Pièce",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("pieceOfficielle.dateObtention","Date Pièce",true,TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("telephones.value","Téléphone principal",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("emails[0].value","Email principal",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("adresses[0].value","Adresse principal",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("username","Compte Utilisateur",true,TypeColonne.STRING,true,""))

    // .pushColumn(new SycadTableColonne("fonction","Fonction",true,TypeColonne.STRING,true,""))

    this.monTableau.typeRessource="IndivisionResource";
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
    tableauComponent.instance.backendApiService=this.indivisionsService;
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
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_INDIVISION}/edition`]);
  }
  public modifier(contribuale) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_INDIVISION}/edition`,contribuale.guid]);
  }
  public supprimer(data) {


    this.indivisionsService.delete(data.guid).subscribe(
      data => {
        this.openSnackBar("Agent supprimé avec succès","OK");

      },
      errorResponse => {
        this.openSnackBar("Impossible de supprimer le contribuable moral","OK");
      }
    );
  }

  public onViewProfil(contribuale) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_VIEW_PROFIL_INDIVISION}`,contribuale.guid]);
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
