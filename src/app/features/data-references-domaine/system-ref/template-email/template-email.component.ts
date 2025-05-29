import {
  Compiler,
  Component,
  Injector,
  NgModuleFactory,
  OnInit,
  ViewChild,
  ViewContainerRef,
  TemplateRef,
  ViewEncapsulation,
} from "@angular/core";
import { Subject } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne,
} from "@sycadApp/libs/model-table";
import { AbstractSycadTableComponent } from "@sycadApp/libs/sycad-table/sycad-table-abstract.component";
import { TemplateEmail } from "@sycadApp/models/data-references/system/template-email";
import { TemplateEmailService } from '@sycadApp/services/data-references/system/template-email.service';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import { FormTemplateEmailComponent } from './form-template-email/form-template-email.component';
import { environment } from "environments/environment";
import { Router } from "@angular/router";
import { AppSettingsService } from "@sycadApp/config/app.settings.service";


@Component({
  selector: "app-template-email",
  templateUrl: "./template-email.component.html",
  styleUrls: ["./template-email.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TemplateEmailComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  @ViewChild("template-email-data") tpl: TemplateRef<any>;

  public refeshDataSubject: Subject<string> = new Subject<string>();

  public getAnchor(): ViewContainerRef {
    return this.anchor;
  }

  constructor(
    private _snackBar: MatSnackBar,
    private mediaObserver: MediaObserver,
    public dialog: MatDialog,
    private compiler: Compiler,
    private router: Router,
    private injector: Injector,
    public appSettings: AppSettingsService,
    public templateEmailService: TemplateEmailService
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
    tableauComponent.instance.backendApiService = this.templateEmailService;
    tableauComponent.instance.actions = this.actions;
    tableauComponent.instance.onEditData.subscribe(($event) => this.modifier($event));
    tableauComponent.instance.onGenericAction.subscribe(($event) => this.genericAction($event));
    tableauComponent.instance.refeshDataSubject = this.refeshDataSubject;
  }

  ngAfterViewInit() {
    this.monTableau.templateExpand = this.tpl;
  }

  ngOnInit(): void {
    this.monTableau = new SycadTableMetaData("Tableau des templates emails", false, false);
    this.monTableau.isCreationActive = false;
    this.monTableau.isDeletable = false;
    this.monTableau.isEditable = true;
    this.monTableau.isExpand = true;
    this.monTableau
      .pushColumn(new SycadTableColonne("titre", "Titre", true, TypeColonne.STRING, true, "", true))
      .pushColumn(new SycadTableColonne("subject", "Sujet", true, TypeColonne.STRING, true, "", true))
      .pushColumn(new SycadTableColonne("code", "code", true, TypeColonne.STRING, true, "", true))
      .pushColumn(
        new SycadTableColonne("contexte", "contexte", true, TypeColonne.STRING, true, "", true)
      );

    this.loadComponent();
  }
  public activeMediaQuery = '';
  ngAfterContentInit() {
  }


  public modifier(templateEmail: TemplateEmail) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_TEMPLATE_EMAIL}/edition`, templateEmail.code]);
    }

  public genericAction(context: GenericActionEvent) {
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }
  private getCorrectWidth() {

    if(this.mediaObserver.isActive("xs")) {
     return {
      width: '90vw',
      height: '80vh',
       position: {
        top:'2vh',
      }
     };
    }

    if(this.mediaObserver.isActive("sm")) {
      return {
        width: '70vw',
        height: '80vh',
         position: {
          top:'2vh',
        }
       };
    }

    if(this.mediaObserver.isActive("md")) {
      return {
        width: '50vw',
        height: '80vh',
         position: {
          top:'2vh',
        }
       };
    }

    if(this.mediaObserver.isActive("lg")) {
      return {
        width: '70vw',
        height: '80vh',
         position: {
          top:'2vh',
        }
       };
    }
    if(this.mediaObserver.isActive("xl")) {
      return {
        width: '50vw',
        height: '80vh',
         position: {
          top:'2vh',
        }
       };
    }
  }

}
