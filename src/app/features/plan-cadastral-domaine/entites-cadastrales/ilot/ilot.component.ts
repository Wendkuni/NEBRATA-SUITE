import {
  Compiler,
  Component,
  Injector,
  NgModuleFactory,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {AbstractSycadTableComponent} from "@sycadApp/libs/sycad-table/sycad-table-abstract.component";
import {Subject} from "rxjs";
import {MediaObserver} from "@angular/flex-layout";
import { IlotService } from '@sycadApp/services/cession-parcelle/ilot.service';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from "@sycadApp/libs/model-table";

@Component({
  selector: 'app-ilot',
  templateUrl: './ilot.component.html',
  styleUrls: ['./ilot.component.scss']
})
export class IlotComponent  extends AbstractSycadTableComponent implements OnInit {

  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(  private mediaObserver: MediaObserver,
                private injector: Injector,
                private compiler: Compiler,
                public ilotService: IlotService) {super(); }


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
    tableauComponent.instance.backendApiService=this.ilotService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;

  }


  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des Ilots",false,false);
    this.monTableau.isCreationActive=false;
    this.monTableau.isDeletable=false;
    this.monTableau.isEditable=false;
    this.monTableau.isOnlyListing=true;

    this.monTableau.typeRessource="IlotResource";
    this.monTableau
      .pushColumn(new SycadTableColonne("numero","N° ilot",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("numeroAncien","N° ancien ilot",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("section.numero","N° section",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("section.numeroAncien","N° ancien section",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("section.commune.nom","Commune",true,TypeColonne.STRING,true,"",true));
    this.loadComponent();
  }
  public genericAction(context: GenericActionEvent) {

  }
}
