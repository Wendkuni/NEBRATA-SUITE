import { Component, OnInit, ViewContainerRef, ViewChild, NgModuleFactory,Compiler, Injector } from '@angular/core';
import { GenericActionEvent, SycadTableColonne, TypeColonne, SycadTableMetaData } from '@sycadApp/libs/model-table';
import { FormLocaliteComponent } from './form-localite/form-localite.component';
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';
import { AbstractSycadTableComponent } from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { LocaliteElement } from '@sycadApp/models/data-references/territoire/localite.model';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import { StatsExport } from '@sycadApp/shared/directives/export.service';


@Component({
  selector: 'app-localite',
  templateUrl: './localite.component.html',
  styleUrls: ['./localite.component.scss']
})
export class LocaliteComponent   extends AbstractSycadTableComponent implements OnInit {

  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }

  constructor( private _snackBar: MatSnackBar,
               private mediaObserver: MediaObserver,
               public dialog: MatDialog,private compiler: Compiler,
               private injector: Injector,public localiteService : LocaliteService)
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
    tableauComponent.instance.backendApiService=this.localiteService;
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
    this.monTableau= new SycadTableMetaData("Tableau des localités",true,false);
    this.monTableau
      .pushColumn(new SycadTableColonne("code","Code",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("nom","Nom",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("typeLocalite","Type Localite",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("arrondissement.nom","Arrondissement",true,TypeColonne.STRING,true,""));

      this.monTableau.typeRessource="LocaliteResource";

    this.loadComponent();
  }
  public openFormModal(localite: LocaliteElement){
    let { width,height,position}=this.getCorrectWidth();
     this.dialogRef = this.dialog.open(FormLocaliteComponent, {
      data: localite,
       panelClass:"sycad-dialog-form",
       width: width,
       height: height,
       position: position,
       disableClose:true
    });

    this.dialogRef.afterClosed().subscribe(localite => {
      if(localite){
        if(localite.id) {
          this.openSnackBar("La localité est modifiée avec succès","OK");   
        }else {
         this.openSnackBar("La localité est ajoutée avec succès","OK");
        }
      }
     
    });

  }
  public ajout() {
    this.openFormModal(null);
  }

  public dialogRef: MatDialogRef<FormLocaliteComponent,any>;

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
  public modifier(localite) {
    this.localiteService.get(localite.id).subscribe(localiteElement => {
      this.openFormModal(localiteElement);
    },
    errorResponse => {
      this.openSnackBar("Impossible de récupérer la localité depuis le serveur","OK");
    })

  }

  public supprimer(data) {
    this.localiteService.delete(data.id).subscribe(
      data => {
        this.openSnackBar("La localité est supprimée avec succès","OK");
        this.refeshDataSubject.next("");
      },
      errorResponse => {
        let errorData = errorResponse.error;

        //console.log(errorData)

        this.openSnackBar("Impossible de supprimer la localité","OK");
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
