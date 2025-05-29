import {
  Compiler,
  Component,
  Injector,
  NgModuleFactory,
  OnInit,
  ViewChild,
  ViewContainerRef,
  TemplateRef
} from '@angular/core';
import {Subject} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from "@sycadApp/libs/model-table";
import {AbstractSycadTableComponent} from "@sycadApp/libs/sycad-table/sycad-table-abstract.component";
import { Parametre } from '@sycadApp/models/data-references/system/model';
import { DataStoreService } from '@sycadApp/services/data-references/system/data-store.service';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import { FormStoreComponent } from './form-data-store/form-datastore.component';
import {StatsExport} from '@sycadShared/directives/export.service';


@Component({
  selector: 'app-data-store',
  templateUrl: './data-store.component.html',
  styleUrls: ['./data-store.component.scss']
})
export class DataStoreComponent extends AbstractSycadTableComponent implements OnInit {

  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  @ViewChild("templateDataStore") tpl: TemplateRef<any>;

  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }

  constructor( private _snackBar: MatSnackBar,
               private mediaObserver: MediaObserver,
               public dialog: MatDialog, private compiler: Compiler,
               private injector: Injector,
               public dataStoreService: DataStoreService) {super(); }

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
    tableauComponent.instance.backendApiService=this.dataStoreService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onEditData.subscribe($event =>  this.modifier($event));
    tableauComponent.instance.onDeleteData.subscribe($event =>  this.supprimer($event));
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
    this.monTableau=new SycadTableMetaData("Tableau des data-store",false,false);
    this.monTableau.isCreationActive=false;
    this.monTableau.isDeletable=false;
    this.monTableau.isEditable=true;
    this.monTableau.isExpand=true;

    this.monTableau.typeRessource="ParametreResource";

    this.monTableau.preShowColumnValue = (colonne, key)=>{

      if(colonne.typeValeurParametre==="TEXTRICHE") {
        return "Texte riche (voir expand)";
      }
      return colonne[key];
    };


    this.monTableau
      .pushColumn(new SycadTableColonne("description","description",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("categorieParametre","Catégorie",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("typeValeurParametre","Type",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("valeur","Valeur",true,TypeColonne.MIXTEVALUE,false,"",false))

    this.loadComponent();
  }

  public openFormModal(parametre: Parametre){
    let { width,height,position}=this.getCorrectWidth();

    this.dialogRef = this.dialog.open(FormStoreComponent, {
      data: parametre,
      panelClass:"sycad-dialog-form",
      width: width,
      height: height,
      position: position,
      disableClose:true
    });

    this.dialogRef.afterClosed().subscribe(role => {
      if(role) {
        // this.openSnackBar("Element ajouté avec succès","OK");
        this.refeshDataSubject.next("");
      }

    });

  }
  public dialogRef: MatDialogRef<FormStoreComponent,any>;

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    // // console.log("this.activeMediaQuery",this.activeMediaQuery)

      if(this.dialogRef) {
        let { width,height,position}=this.getCorrectWidth();
        this.dialogRef.updateSize(width, height);
        this.dialogRef.updatePosition(position);
      }

    });
  }
  public modifier(role) {
    this.openFormModal(role);
  }
  public supprimer(data) {
    this.dataStoreService.delete(data.id).subscribe(
      data => {
        this.openSnackBar("La data store est supprimée avec succès","OK");
        this.refeshDataSubject.next("");
      },
      errorResponse => {
        let errorData = errorResponse.error;

      // // console.log(errorData)

        this.openSnackBar("Impossible de supprimer la data store","OK");
      }
    );
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
  private getCorrectWidth() {

    if(this.mediaObserver.isActive("xs")) {
      return {
        width: '90vw',
        height: '60vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("sm")) {
      return {
        width: '70vw',
        height: '60vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("md")) {
      return {
        width: '50vw',
        height: '60vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("lg")) {
      return {
        width: '35vw',
        height: '60vh',
        position: {
          top:'2vh',
        }
      };
    }
    if(this.mediaObserver.isActive("xl")) {
      return {
        width: '30vw',
        height: '60vh',
        position: {
          top:'2vh',
        }
      };
    }
  }
}
