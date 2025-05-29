
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
import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import { MenuService } from '@sycadApp/services/data-references/system/menu.service';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import { Menu } from '@sycadApp/layout/menu/menu.model';
import {environment} from '../../../../../environments/environment';
import {Router} from '@angular/router';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent extends AbstractSycadTableComponent implements OnInit {

  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor( private _snackBar: MatSnackBar,
               private mediaObserver: MediaObserver,
               private compiler: Compiler,
               private injector: Injector, public menuService: MenuService,
               private router: Router)
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
    tableauComponent.instance.tableDescription=this.monTableau;
    tableauComponent.instance.backendApiService = this.menuService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onEditData.subscribe($event =>  this.modifier($event));
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;

  }
  ngOnInit(): void {
    this.monTableau= new SycadTableMetaData("Tableau des menus",true,false);
    this.monTableau.isCreationActive=false;
    this.monTableau.isDeletable=false;
    this.monTableau.isEditable=true;
    this.monTableau.isExport=false;
    this.monTableau
      .pushColumn(new SycadTableColonne("titre","Titre",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("ordre","Ordre",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("hasSubMenu","Est sous menu",true,TypeColonne.BOOLEAN,true,""))
      .pushColumn(new SycadTableColonne("parentId","Parent",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("icon","Icone",true,TypeColonne.STRING,true,""))

    this.loadComponent();
  }

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
      //// console.log("this.activeMediaQuery",this.activeMediaQuery)
    });
  }


  public modifier(menu: Menu) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.APP_MENU}/edition`, menu.id]);

  }
  public genericAction(context: GenericActionEvent) {
    // // console.log("une action quelconque  ",context)
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top'

    });
  }
}
