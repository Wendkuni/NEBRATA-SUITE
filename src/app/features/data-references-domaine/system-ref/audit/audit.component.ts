import {
  Compiler,
  Component,
  Injector,
  NgModuleFactory,
  OnInit,
  ViewChild,
  ViewContainerRef,
  TemplateRef,
} from "@angular/core";
import { Subject } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne,
} from "@sycadApp/libs/model-table";
import { AbstractSycadTableComponent } from "@sycadApp/libs/sycad-table/sycad-table-abstract.component";
import { Audit } from "@sycadApp/models/data-references/system/audit";
import { AuditService } from '@sycadApp/services/data-references/system/audit.service';


@Component({
  selector: "app-audit",
  templateUrl: "./audit.component.html",
  styleUrls: ["./audit.component.scss"],
})
export class AuditComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  @ViewChild("templateAudits") tpl: TemplateRef<any>;

  public refeshDataSubject: Subject<string> = new Subject<string>();

  public getAnchor(): ViewContainerRef {
    return this.anchor;
  }

  constructor(
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private compiler: Compiler,
    private injector: Injector,
    public auditService: AuditService
  ) {
    super();
  }

  public async loadComponent() {
    this.componentFactories = [];
    const { SycadTableComponent, SycadTableModule } = await import(
      "@sycadApp/libs/sycad-table/sycad-table.component"
    );
    const moduleFactory =
      SycadTableModule instanceof NgModuleFactory
        ? SycadTableModule
        : await this.compiler.compileModuleAsync(SycadTableModule);
    const moduleRef = moduleFactory.create(this.injector);
    const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(
      SycadTableComponent
    );
    this.anchor.clear();
    const tableauComponent = this.anchor.createComponent(componentFactory);
    tableauComponent.instance.tableDescription = this.monTableau;
    tableauComponent.instance.backendApiService = this.auditService;
    tableauComponent.instance.actions = this.actions;
    tableauComponent.instance.onGenericAction.subscribe(($event) => this.genericAction($event));
    tableauComponent.instance.refeshDataSubject = this.refeshDataSubject;
  }
  ngAfterViewInit() {
    this.monTableau.templateExpand = this.tpl;
  }
  ngOnInit(): void {
    this.monTableau = new SycadTableMetaData("Tableau des audits", false, false);
    this.monTableau.isCreationActive = false;
    this.monTableau.isDeletable = false;
    this.monTableau.isEditable = false;
    this.monTableau.isExpand = true;

    this.monTableau
      .pushColumn(
        new SycadTableColonne("date", "Date De Creation", true, TypeColonne.STRING, true, "", true)
      )
      .pushColumn(
        new SycadTableColonne("userGuid", "userGuid", true, TypeColonne.STRING, true, "", true)
      )
      .pushColumn(
        new SycadTableColonne("userIp", "userIp", true, TypeColonne.STRING, true, "", true)
      )
      .pushColumn(
        new SycadTableColonne("clientOS", "clientOS", true, TypeColonne.STRING, true, "", true)
      )
      .pushColumn(
        new SycadTableColonne("ressource", "ressource", true, TypeColonne.STRING, true, "", true)
      )
      .pushColumn(
        new SycadTableColonne("actionType", "actionType", true, TypeColonne.STRING, true, "", true)
      );

    this.loadComponent();
  }

  public genericAction(context: GenericActionEvent) {
    //console.log("une action quelconque  ", context);
  }
}
