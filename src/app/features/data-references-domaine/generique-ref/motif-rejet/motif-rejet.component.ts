
import {
  Compiler,
    Component,
    Injector,
    NgModuleFactory,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {from, Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import { CategorieImmeubleService } from '@sycadApp/services/data-references/system/categorie-immeuble.service';
import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import {StatsExport} from '@sycadShared/directives/export.service';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import {
  environment
} from "../../../../../environments/environment";
import {Router} from "@angular/router";
import {
  TypeTransitionService
} from "@sycadApp/services/data-references/system/type-transition.service";
import {
  MotifRejetService
} from "@sycadApp/services/data-references/system/motif-rejet.service";

@Component({
  selector: 'app-motif-rejet',
  templateUrl: './motif-rejet.component.html',
  styleUrls: ['./motif-rejet.component.scss']
})
export class MotifRejetComponent extends AbstractSycadTableComponent implements OnInit {
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
              private injector: Injector,public motifRejetService: MotifRejetService)
  {super(); }
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
    tableauComponent.instance.backendApiService=this.motifRejetService;
    tableauComponent.instance.onEditData.subscribe($event =>  this.modifier($event));
    tableauComponent.instance.onDeleteData.subscribe($event =>  this.supprimer($event));
    tableauComponent.instance.onAddData.subscribe($event =>  this.ajout());
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;
  }
  public finishExport(event: StatsExport) {
    this._snackBar.open(`Export motif rejet terminée. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }
  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des types de transitions",true,false);
    this.monTableau.isCreationActive=true;
    this.monTableau.isDeletable=true;
    this.monTableau.isEditable=true;
    this.monTableau.isExpand=true;
    this.monTableau
      .pushColumn(new SycadTableColonne("code","Code",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("libelle","Libellé",true,TypeColonne.STRING,true,""))


    this.monTableau.typeRessource="MotifRejetResource";

    this.loadComponent();
  }

  public activeMediaQuery = '';

  public ajout() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_MOTIF_REJET}/edition`]);
  }
  public modifier(motifrejet) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_MOTIF_REJET}/edition`, motifrejet.id]);
  }
  public supprimer(data) {
    this.motifRejetService.delete(data.id).subscribe(
      data => {
        this.openSnackBar("Element supprimé avec succès","OK");
        this.refeshDataSubject.next("");
      },
      errorResponse => {
        let errorData = errorResponse.error;

        this.openSnackBar("Impossible de supprimer cet élément","OK");
      }
    );
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
