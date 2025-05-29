import { Component, OnInit, ViewChild, ViewContainerRef, Compiler, NgModuleFactory, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { AbstractSycadTableComponent } from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import { SycadTableMetaData, SycadTableColonne, TypeColonne, GenericActionEvent } from '@sycadApp/libs/model-table';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { FormCommuneComponent } from './form-communes/form-communes.component';
import { CommuneElement } from '@sycadApp/models/data-references/territoire/commune.model';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import { StatsExport } from '@sycadApp/shared/directives/export.service';

@Component({
  selector: 'app-communes',
  templateUrl: './communes.component.html',
  styleUrls: ['./communes.component.scss']
})
export class CommunesComponent extends AbstractSycadTableComponent implements OnInit {


  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }

  constructor( private _snackBar: MatSnackBar,
               private mediaObserver: MediaObserver,
               public dialog: MatDialog,private compiler: Compiler,
               private injector: Injector,public CommunesService: CommunesService)
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
    tableauComponent.instance.backendApiService=this.CommunesService;
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
    this.monTableau= new SycadTableMetaData("Tableau des communes",true,false);
    this.monTableau
      .pushColumn(new SycadTableColonne("code","Code",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("nom","Nom",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("typeCommune","Type Commune",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("province.nom","Province",true,TypeColonne.STRING,true,""))
      this.monTableau.typeRessource="CommuneResource";
    this.loadComponent();
  }
  public openFormModal(commune: CommuneElement){
    let { width,height,position}=this.getCorrectWidth();
     this.dialogRef = this.dialog.open(FormCommuneComponent, {
      data: commune,
       panelClass:"sycad-dialog-form",
       width: width,
       height: height,
       position: position,
       disableClose:true
    });

    this.dialogRef.afterClosed().subscribe(commune => {
      if(commune){
        if(commune.id) {
          this.openSnackBar("La commune est modifiée avec succès","OK");   
        }else {
         this.openSnackBar("La commune est ajoutée avec succès","OK");
        }
      }
    
    });

  }
  public dialogRef: MatDialogRef<FormCommuneComponent,any>;

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
     //// console.log("this.activeMediaQuery",this.activeMediaQuery)

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

  public modifier(commune) {
    this.CommunesService.get(commune.id).subscribe(communeElement => {
      this.openFormModal(communeElement);
    },
    errorResponse => {
      this.openSnackBar("Impossible de récupérer la commune depuis le serveur","OK");
    })

  }

  public supprimer(data) {
    this.CommunesService.delete(data.id).subscribe(
      data => {
        this.openSnackBar("La commune est supprimée avec succès","OK");
        this.refeshDataSubject.next("");
      },
      errorResponse => {
        let errorData = errorResponse.error;

       //// console.log(errorData)

        this.openSnackBar("Impossible de supprimer la commune","OK");
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
        width: '35vw',
        height: '80vh',
        position: {
          top:'2vh',
        }
      };
    }
    if(this.mediaObserver.isActive("xl")) {
      return {
        width: '30vw',
        height: '80vh',
        position: {
          top:'2vh',
        }
      };
    }
  }
}
