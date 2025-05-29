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
import {AbstractSycadTableComponent} from "@sycadApp/libs/sycad-table/sycad-table-abstract.component";
import {MediaObserver} from "@angular/flex-layout";
import { SectionService } from '@sycadApp/services/cession-parcelle/section.service';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from "@sycadApp/libs/model-table";

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss']
})
export class SectionsComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(private mediaObserver: MediaObserver,
              private injector: Injector,
              private compiler: Compiler,
              public sectionService: SectionService)
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
    tableauComponent.instance.backendApiService=this.sectionService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;

  }
  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des sections",false,false);
    this.monTableau.isCreationActive=false;
    this.monTableau.isDeletable=false;
    this.monTableau.isEditable=false;
    this.monTableau.isOnlyListing=true;

    this.monTableau.typeRessource="SectionResource";
    this.monTableau
      .pushColumn(new SycadTableColonne("numero","Numéro",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("numeroAncien","Numéro ancien",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("commune.nom","Commune",true,TypeColonne.STRING,true,"",true));
     this.loadComponent();
  }
  public genericAction(context: GenericActionEvent) {
  }
}
