import { ConfigWorkflowService } from './../../services/workflow/config-workflow.service';
import {
  Compiler,
  Component,
  Injector,
  NgModuleFactory,
  OnInit,
  ViewChild,
  ViewContainerRef,
  TemplateRef, ViewEncapsulation
} from '@angular/core';
import {Subject} from 'rxjs';
import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {
  ActionElementEvent,
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import {environment} from "../../../environments/environment";
import {AppSettingsService} from "@sycadSetting/app.settings.service";
import {Router} from "@angular/router";
import {AppConfirmService} from "@sycadShared/app-confirm/app-confirm.service";
import {StatsExport} from '@sycadShared/directives/export.service';


@Component({
  selector: 'app-config-workflow',
  templateUrl: './config-workflow.component.html',
  styleUrls: ['./config-workflow.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfigWorkflowComponent extends AbstractSycadTableComponent implements OnInit {

  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  @ViewChild("templateConfigWorkflow") tpl: TemplateRef<any>;


  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }

  constructor(  private _snackBar: MatSnackBar,   public dialog: MatDialog, private compiler: Compiler, private injector: Injector,
               public configWorkflowService: ConfigWorkflowService, public appSettings: AppSettingsService,
                private router: Router,
                public confirmService: AppConfirmService) {super(); }

  public async loadComponent() {
    this.componentFactories = [];
    const { SycadTableComponent, SycadTableModule } = await import('@sycadApp/libs/sycad-table/sycad-table.component');
    const moduleFactory = SycadTableModule instanceof NgModuleFactory ? SycadTableModule
      : (await this.compiler.compileModuleAsync(SycadTableModule));
    const moduleRef = moduleFactory.create(this.injector);
    const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(SycadTableComponent);
    this.anchor.clear();
    this.monTableau.actionElement = new ActionElementEvent("Visualiser", true);
    const tableauComponent = this.anchor.createComponent(componentFactory);
    tableauComponent.instance.tableDescription=this.monTableau;
    tableauComponent.instance.backendApiService=this.configWorkflowService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onEditData.subscribe($event =>  this.modifier($event));
    tableauComponent.instance.onActionElementData.subscribe($event =>  this.consulter($event));
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;

  }
  ngAfterViewInit() {
    this.monTableau.templateExpand= this.tpl;
  }

  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des configurations workflow",true,false, false, "", false);

    this.monTableau.isExpand=true;
    this.monTableau.typeRessource="ConfigWorkflowResource";
    this.monTableau.isDeletable=false;

    this.monTableau
      .pushColumn(new SycadTableColonne("code", "Code",true,TypeColonne.STRING,true,"",))
      .pushColumn(new SycadTableColonne("libelle", "Libellé",true,TypeColonne.STRING,true,"",))
      .pushColumn(new SycadTableColonne("description", "Description",true,TypeColonne.STRING,true,"",))
      .pushColumn(new SycadTableColonne("nbJours", "Nombre de jours",true,TypeColonne.STRING,true,""))
       this.loadComponent();
  }

  public finishExport(event: StatsExport) {
    this._snackBar.open(`Exportation terminée. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }

  public activeMediaQuery = '';
  ngAfterContentInit() {
  }

  public modifier(data) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_WORKFLOW}/edition`, data.code]);
  }

  public consulter(data) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_WORKFLOW}/consultation`, data.code]);
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
