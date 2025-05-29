import {
  Compiler,
  Component,
  Injector,
  NgModuleFactory,
  OnInit, TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Subject} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from '@angular/material/dialog';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from "@sycadApp/libs/model-table";

import {AbstractSycadTableComponent} from "@sycadApp/libs/sycad-table/sycad-table-abstract.component";

import { ServiceElement } from '@sycadApp/models/data-references/organigramme/service.model';
import { ServiceAdministratifService } from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';
import { MediaObserver} from '@angular/flex-layout';
import {ActivatedRoute, Router} from "@angular/router";
import {AppConfirmService} from "@sycadShared/app-confirm/app-confirm.service";
import {environment} from "../../../../../environments/environment";
import {StatsExport} from '@sycadShared/directives/export.service';



@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent  extends AbstractSycadTableComponent implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  @ViewChild("templateService") tpl: TemplateRef<any>;


  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }

  constructor( private _snackBar: MatSnackBar,private mediaObserver: MediaObserver,
               public dialog: MatDialog,private compiler: Compiler,
               private injector: Injector,public serviceAdministratifService : ServiceAdministratifService,
               private router: Router,
               private route: ActivatedRoute,public confirmService: AppConfirmService)
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
    tableauComponent.instance.backendApiService=this.serviceAdministratifService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onEditData.subscribe($event =>  this.modifier($event));
    tableauComponent.instance.onDeleteData.subscribe($event =>  this.supprimer($event));
    tableauComponent.instance.onAddData.subscribe($event =>  this.ajout());
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;

  }

ngAfterViewInit(){
  this.monTableau.templateExpand= this.tpl;
}

  ngOnInit(): void {
    this.monTableau = new SycadTableMetaData("Tableau des services",true,false);
    this.monTableau.isExpand = true;
    this.monTableau.typeRessource="ServiceResource";

    this.monTableau
       .pushColumn(new SycadTableColonne("code","Code",true,TypeColonne.STRING,true,""))
       .pushColumn(new SycadTableColonne("nom","Nom",true,TypeColonne.STRING,true,""))
       .pushColumn(new SycadTableColonne("structure.nom","Structure",true,TypeColonne.STRING,true,""))
       .pushColumn(new SycadTableColonne("sigle","Sigle",true,TypeColonne.STRING,true,""))
       .pushColumn(new SycadTableColonne("localisation.designation","Désignation",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("localisation.emailDeService","Email",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("localisation.telephoneDeService","Téléphone",true,TypeColonne.STRING,true,""))
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
  public ajout() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.ORGANIGRAMME_SERVICE}/edition`]);
  }
  public modifier(serviceAdministratif: ServiceElement) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.ORGANIGRAMME_SERVICE}/edition`, serviceAdministratif.id]);
  }

  public supprimer(data) {
    this.serviceAdministratifService.delete(data.id).subscribe(
      data => {
        this.openSnackBar("Le service est supprimé avec succès","OK");
        this.refeshDataSubject.next("");
      },
      errorResponse => {
        let errorData = errorResponse.error;

        this.openSnackBar("Impossible de supprimer le service","OK");
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
