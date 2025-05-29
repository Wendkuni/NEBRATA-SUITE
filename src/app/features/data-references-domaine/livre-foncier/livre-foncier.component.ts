import {
  Compiler,
  Component,
  Injector,
  NgModuleFactory,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Subject} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from '@angular/material/dialog';
import {AbstractSycadTableComponent} from "@sycadApp/libs/sycad-table/sycad-table-abstract.component";
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from "@sycadApp/libs/model-table";

import { LivreFoncier } from '@sycadApp/models/data-references/contribuables/global.model';
import {StatsExport} from '@sycadShared/directives/export.service';
import { LivreFoncierService } from '@sycadApp/services/data-references/system/livre-foncier.service';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';


@Component({
  selector: 'app-livre-foncier',
  templateUrl: './livre-foncier.component.html',
  styleUrls: ['./livre-foncier.component.scss']
})
export class LivreFoncierComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild('datatable1', { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(private _snackBar: MatSnackBar,
              public dialog: MatDialog,
              private router: Router,
              private compiler: Compiler,
              private injector: Injector,
              private mediaObserver: MediaObserver,
              public livreFoncierService: LivreFoncierService)
  {
    super();
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
    tableauComponent.instance.tableDescription= this.monTableau;
    tableauComponent.instance.backendApiService= this.livreFoncierService;
    tableauComponent.instance.actions= this.actions;
    tableauComponent.instance.onEditData.subscribe($event =>  this.modifier($event));
    tableauComponent.instance.onDeleteData.subscribe($event =>  this.supprimer($event));
    tableauComponent.instance.onAddData.subscribe($event =>  this.ajout());
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.refeshDataSubject= this.refeshDataSubject;

  }

  public finishExport(event: StatsExport) {
    this._snackBar.open(`Exportation terminée. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }

  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des livres fonciers",true,false);
    this.monTableau.isExpand=true;
    this.monTableau.typeRessource="LivreFoncierResource";
    this.monTableau
      .pushColumn(new SycadTableColonne("libelle","Libellé",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("code","Code",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("circonscription","Circonscription",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("dernierNumero","Dernier Numéro",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("structure.nom","Structure",true,TypeColonne.STRING,true,""))
    this.loadComponent();
  }

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  public ajout() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.ORGANIGRAMME_LIVRE_FONCIER}/edition`]);
  }

  public modifier(livreFoncier: LivreFoncier) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.ORGANIGRAMME_LIVRE_FONCIER}/edition`, livreFoncier.id]);
  }

  public supprimer(livreFoncier) {
    this.livreFoncierService.delete(livreFoncier.id).subscribe(
      data => {
        this.openSnackBar("La catégorie de pièce est supprimée avec succès","OK");
        this.refeshDataSubject.next("");
      },
      errorResponse => {
        let errorData = errorResponse.error;
        this.openSnackBar("Impossible de supprimer la catégorie de piéce","OK");
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
