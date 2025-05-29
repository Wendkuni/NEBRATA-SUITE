import {Compiler, Component, Injector, NgModuleFactory, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {ActionElementEvent, GenericActionEvent, SycadTableColonne, SycadTableMetaData, TypeColonne} from '@sycadApp/libs/model-table';
import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import {Subject, timeout} from "rxjs";
import {FormPageIndexationComponent} from '@sycadFeature/data-references-domaine/system-ref/gestion-indexation/form-page-indexation/form-page-indexation.component';
import {IndexationService} from '@sycadApp/services/data-references/system/indexation.service';
import {Indexation} from '@sycadApp/models/data-references/system/model';
import { SycadUtils } from '@sycadApp/shared/utils.functions';

@Component({
  selector: 'app-gestion-indexation',
  templateUrl: './gestion-indexation.component.html',
  styleUrls: ['./gestion-indexation.component.scss']
})
export class GestionIndexationComponent extends AbstractSycadTableComponent implements OnInit {

  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }

  constructor( private _snackBar: MatSnackBar,
               private mediaObserver: MediaObserver,
               public dialog: MatDialog,private compiler: Compiler,
               private injector: Injector,
               public confirmService: AppConfirmService,
               public indexService: IndexationService)
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
    tableauComponent.instance.backendApiService=this.indexService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onEditData.subscribe($event =>  this.modifier($event));
    tableauComponent.instance.onDeleteData.subscribe($event =>  this.supprimer($event));
    tableauComponent.instance.onAddData.subscribe($event =>  this.ajout());
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.onActionElementData.subscribe($event =>  this.reindexerType($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;

  }


  public isLoadingResults:Boolean = false;
  public reindexerAll() {

    this.confirmService
    .confirm({
      title: "Confirmation",
      message: `Voulez-vous lancer la reindexation de la base de données ? `,
    })
    .subscribe(($choix) => {

      if($choix){
        this.isLoadingResults=true;

        this.indexService.indexAllObject().pipe( timeout(30*60*1000)).subscribe(response => {
            this.isLoadingResults=false;
            this.openSnackBar("La base de données a été rindexée avec succès ", "OK");
            this.refeshDataSubject.next("");
          },
          errorResponse =>{
           // console.log("errorResponse",errorResponse)
            this.isLoadingResults=false;
            let mes= {
              message:"La requête d'indexation ne s'est pas bien passé"
            }
            SycadUtils.notifyRemoteError(mes, this._snackBar);
          }
        ); 
      }
  

    });

 
  }
  reindexerType(model:Indexation) {

    this.confirmService
    .confirm({
      title: "Confirmation",
      message: `Voulez-vous lancer l'indexation de ce type ? `,
    })
    .subscribe(($choix) => {
     

      if($choix){
        this.isLoadingResults=true;
        
        this.indexService.indexOneObjet(model.id).pipe( timeout(30*60*1000)).subscribe(response => {
          this.isLoadingResults=false;
            this.openSnackBar("L'objet a été reindexé avec succès ", "OK");
            this.refeshDataSubject.next("");
          },
          errorResponse =>{
            this.isLoadingResults=false;
            let mes= {
              message:"La requête d'indexation ne s'est pas bien passé"
            }
            SycadUtils.notifyRemoteError(mes, this._snackBar);
          }
        );
      }
  
    });

 

}
  ngOnInit(): void {
    this.monTableau = new SycadTableMetaData("Tableau des types indexables",true,false);
    this.monTableau.isCreationActive=true;
    this.monTableau.isExpand = true;

    this.monTableau.actionElement=new ActionElementEvent("Reindexer",true,"update");;

    this.monTableau
      .pushColumn(new SycadTableColonne("libelle","Nom du type",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("lastIndexationDate","Date dernière indexation",true,TypeColonne.DATETIME,true,""));

      
    this.loadComponent();
  }


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
  public modifier(index) {
    this.openFormModal(index);
  }
  public supprimer(data) {
    this.indexService.delete(data.id).subscribe(
      data => {
        this.openSnackBar("L'élément indexable supprimé avec succès","OK");
        this.refeshDataSubject.next("");
      },
      errorResponse => {
        let errorData = errorResponse.error;


        this.openSnackBar("Impossible de supprimer cet élément indexable","OK");
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

  public openFormModal(index: Indexation){
    let { width,height,position}=this.getCorrectWidth();
    this.dialogRef = this.dialog.open(FormPageIndexationComponent, {
      data: index,
      panelClass:"sycad-dialog-form",
      width: width,
      height: height,
      position: position,
      disableClose:true
    });

    this.dialogRef.afterClosed().subscribe(index => {
      if(index) {
        // this.openSnackBar("L'élément indexable est ajouté avec succès","OK");
        this.refeshDataSubject.next("");
      }
 
    });

  }
  public dialogRef: MatDialogRef<FormPageIndexationComponent,any>;

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
        width: '45vw',
        height: '60vh',
        position: {
          top:'2vh',
        }
      };
    }
    if(this.mediaObserver.isActive("xl")) {
      return {
        width: '40vw',
        height: '60vh',
        position: {
          top:'2vh',
        }
      };
    }
  }



}
