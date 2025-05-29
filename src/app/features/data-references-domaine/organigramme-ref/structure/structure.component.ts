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
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import { StructureElement } from '@sycadApp/models/data-references/organigramme/structure.model';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import {environment} from "../../../../../environments/environment";
import {AppSettingsService} from "@sycadSetting/app.settings.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AppConfirmService} from "@sycadShared/app-confirm/app-confirm.service";
import {StatsExport} from '@sycadShared/directives/export.service';


@Component({
  selector: 'app-structure',
  templateUrl: './structure.component.html',
  styleUrls: ['./structure.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StructureComponent extends AbstractSycadTableComponent implements OnInit {

  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  @ViewChild("templateStructure") tpl: TemplateRef<any>;


  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }

  constructor(  private mediaObserver: MediaObserver, private _snackBar: MatSnackBar,   public dialog: MatDialog, private compiler: Compiler, private injector: Injector,
               public structureService: StructureService, public appSettings: AppSettingsService,
                private router: Router,
                private route: ActivatedRoute,public confirmService: AppConfirmService) {super(); }

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
    tableauComponent.instance.backendApiService=this.structureService;
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

  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des structures",true,false);

        this.monTableau.isExpand=true;
        this.monTableau.typeRessource="StructureResource";

    this.monTableau
      .pushColumn(new SycadTableColonne("code","Code",true,TypeColonne.STRING,true,"",))
      .pushColumn(new SycadTableColonne("nom","Nom",true,TypeColonne.STRING,true,"",))
      .pushColumn(new SycadTableColonne("sigle","Sigle",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("parent.nom","Parent",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("typeStructure.nom","Type structure",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("numeroBornage","Numérotation bornage",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("localisation.designation","Localisation",true,TypeColonne.STRING,true,""))
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
    this.router.navigate([`${environment.FRONTEND_ROUTES.ORGANIGRAMME_STRUCTURE}/edition`]);
  }


  public modifier(structure: StructureElement) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.ORGANIGRAMME_STRUCTURE}/edition`, structure.id]);
    }

  public supprimer(data) {
    this.structureService.delete(data.id).subscribe(
      data => {
        this.openSnackBar("La structure est supprimée avec succès","OK");
        this.refeshDataSubject.next("");
      },
      errorResponse => {
        let errorData = errorResponse.error;

        this.openSnackBar("Impossible de supprimer la structure","OK");
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
