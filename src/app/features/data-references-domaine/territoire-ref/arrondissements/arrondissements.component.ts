import {
  Compiler,
  Component,
  Injector,
  NgModuleFactory,
  OnInit, TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Subject} from 'rxjs';
import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import { ArrondissementElement } from '@sycadApp/models/data-references/territoire/arrondissement.model';
import { MediaObserver} from '@angular/flex-layout';
import {environment} from '../../../../../environments/environment';
import {ActivatedRoute, Router} from "@angular/router";
import {AppConfirmService} from "@sycadShared/app-confirm/app-confirm.service";
import { StatsExport } from '@sycadApp/shared/directives/export.service';


@Component({
  selector: 'app-arrondissements',
  templateUrl: './arrondissements.component.html',
  styleUrls: ['./arrondissements.component.scss']
})
export class ArrondissementsComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();
  @ViewChild("templateArrondissement") tpl: TemplateRef<any>;

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor( private _snackBar: MatSnackBar,
               private mediaObserver: MediaObserver,
               public dialog: MatDialog,private compiler: Compiler,
               private injector: Injector,
               public arrondissementService: ArrondissementsService,
  private router: Router,
  private route: ActivatedRoute,public confirmService: AppConfirmService)
  {super(); }

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
    tableauComponent.instance.backendApiService=this.arrondissementService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onEditData.subscribe($event =>  this.modifier($event));
    tableauComponent.instance.onDeleteData.subscribe($event =>  this.supprimer($event));
    tableauComponent.instance.onAddData.subscribe($event =>  this.ajout());
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;

  }

  ngAfterViewInit() {
    this.monTableau.templateExpand= this.tpl;
  }
  public finishExport(event: StatsExport) {
    this._snackBar.open(`Exportation terminée. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }

  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des arrondissements",true,false);
    this.monTableau.isExpand=true;
    this.monTableau
      .pushColumn(new SycadTableColonne("code","Code",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("nom","Nom",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("commune.nom","Commune",true,TypeColonne.STRING,true,""));
      this.monTableau.typeRessource="ArrondissementResource";
    this.loadComponent();
  }

  public activeMediaQuery = '';
  ngAfterContentInit() {

  }
  public ajout() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.TERRITOIRE_ARRONDISSEMENT}/edition`]);
  }


  public modifier(arrondissement: ArrondissementElement) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.TERRITOIRE_ARRONDISSEMENT}/edition`, arrondissement.id]);
    }

  public supprimer(data) {
    this.arrondissementService.delete(data.id).subscribe(
      data => {
        this.openSnackBar("L'arrondissement est supprimé avec succès","OK");
        this.refeshDataSubject.next("");
      },
      errorResponse => {
        let errorData = errorResponse.error;

      // // console.log(errorData)

        this.openSnackBar("Impossible de supprimer l'arrondissement","OK");
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
