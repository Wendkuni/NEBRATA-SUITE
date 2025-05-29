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
import {MatSnackBar} from '@angular/material/snack-bar';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { RegimeFiscalService } from '@sycadApp/services/impot/regime-fiscal.service';

import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import {StatsExport} from '@sycadShared/directives/export.service';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import {RegimeFiscal} from '@sycadApp/models/data-references/contribuables/global.model';
import { FormRegimeFiscalComponent } from './form-regime-fiscal/form-regime-fiscal.component';

@Component({
  selector: 'app-regime-fiscal',
  templateUrl: './regime-fiscal.component.html',
  styleUrls: ['./regime-fiscal.component.scss']
})
export class RegimeFiscalComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();
  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver,
              public dialog: MatDialog,private compiler: Compiler,
              private injector: Injector,public regimeFiscalService: RegimeFiscalService)
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
    tableauComponent.instance.backendApiService=this.regimeFiscalService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onEditData.subscribe($event =>  this.modifier($event));
    tableauComponent.instance.onDeleteData.subscribe($event =>  this.supprimer($event));
    tableauComponent.instance.onAddData.subscribe($event =>  this.ajout());
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;
  }
  public finishExport(event: StatsExport) {
    this._snackBar.open(`Exportation terminée. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }
  ngOnInit(): void {

    this.monTableau=new SycadTableMetaData("Tableau des régimes fiscaux",false,false);

    this.monTableau.typeRessource="RegimeFiscal";

    this.monTableau.preShowColumnValue = (colonne, key)=>{

      if(colonne.typeValeurParametre==="TEXTRICHE") {
        return "Texte riche (voir expand)";
      }
      return colonne[key];
    };



    this.monTableau=new SycadTableMetaData("Tableau des régimes fiscaux",true,false);
    this.monTableau
      .pushColumn(new SycadTableColonne("code","Code",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("libelle","Libellé",true,TypeColonne.STRING,true,""));
    this.monTableau.typeRessource="RegimeFiscalRessource";
    
    this.loadComponent();
  }
public openFormModal(regimeFiscal: RegimeFiscal){
    let { width,height,position}=this.getCorrectWidth();
    this.dialogRef = this.dialog.open(FormRegimeFiscalComponent, {
      data: regimeFiscal,
      panelClass:"sycad-dialog-form",
      width: width,
      height: height,
      position: position,
      disableClose:true
    });

    this.dialogRef.afterClosed().subscribe(secteurActivite => {
      if(secteurActivite) {
        // this.openSnackBar("Le régime fiscal est  ajouté avec succès","OK");
        this.refeshDataSubject.next("");
      }

    });

  }

  public dialogRef: MatDialogRef<FormRegimeFiscalComponent,any>;

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
      if(this.dialogRef) {
        let { width,height,position}=this.getCorrectWidth();
        this.dialogRef.updateSize(width, height);
        this.dialogRef.updatePosition(position);
      }

    });
  }

  public ajout() {
    this.openFormModal(null);
  }
  public modifier(regimeFiscal) {
    this.openFormModal(regimeFiscal);
  }
  public supprimer(data) {
    this.regimeFiscalService.delete(data.id).subscribe(
      data => {
        this.openSnackBar("Le régime fiscal est supprimé avec succès","OK");
        this.refeshDataSubject.next("");
      },
      errorResponse => {
        let errorData = errorResponse.error;

        //// console.log(errorData)

        this.openSnackBar("Impossible de supprimer le régime fiscal","OK");
      }
    );
  }




  public genericAction(context: GenericActionEvent) {
    //console.log("une action quelconque  ",context)
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
