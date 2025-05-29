import {
  Compiler,
  Component,
  Injector,
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
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import {CategorieImmeuble} from '@sycadApp/models/data-references/system/categorie-immeuble.model';
import { FormDroitImmobilierComponent } from '@sycadFeature/data-references-domaine/generique-ref/droit-immobilier/form-droit-immobilier/form-droit-immobilier.component';
import {
  environment
} from "../../../../../environments/environment";
import {Router} from "@angular/router";
import {
  DroitImmobilierService
} from "@sycadApp/services/data-references/system/droit-immobilier.service";

@Component({
  selector: 'app-droit-propriete',
  templateUrl: './droit-immobilier.component.html',
  styleUrls: ['./droit-immobilier.component.scss']
})
export class DroitImmobilierComponent extends AbstractSycadTableComponent implements OnInit {
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
              private injector: Injector,public droitImmobileService: DroitImmobilierService)
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
    tableauComponent.instance.backendApiService=this.droitImmobileService;
    tableauComponent.instance.onEditData.subscribe($event =>  this.modifier($event));
    tableauComponent.instance.onDeleteData.subscribe($event =>  this.supprimer($event));
    tableauComponent.instance.onAddData.subscribe($event =>  this.ajout());
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;
  }
  public finishExport(event: StatsExport) {
    this._snackBar.open(`Export droit immobilier terminée. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }
  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des droits de immobiliers",true,false);

    this.monTableau.isDeletable=false;
    this.monTableau.isEditable=true;
    this.monTableau.isExpand=true;
    this.monTableau
      .pushColumn(new SycadTableColonne("code","Code",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("libelle","Libellé",true,TypeColonne.STRING,true,""))


    this.monTableau.typeRessource="DroitImmobilierResource";

    this.loadComponent();
  }

  public activeMediaQuery = '';

  public ajout() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_DROIT_IMMOBILIER}/edition`]);
  }
  public modifier(documentType) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_DROIT_IMMOBILIER}/edition`, documentType.id]);
  }
  public supprimer(data) {
    this.droitImmobileService.delete(data.id).subscribe(
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
