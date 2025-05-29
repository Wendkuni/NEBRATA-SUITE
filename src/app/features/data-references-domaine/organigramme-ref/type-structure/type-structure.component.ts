import {
  Compiler,
  Component,
  Injector,
  NgModuleFactory,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import {Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {TypeStructureService} from '@sycadApp/services/data-references/organigramme/type-structure.service';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';

import {FormTypeStructureComponent} from '@sycadApp/features/data-references-domaine/organigramme-ref/type-structure/form-type-structure/form-type-structure.component';
import { TypeStructure } from '@sycadApp/models/data-references/organigramme/type-structure.model';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import {StatsExport} from '@sycadShared/directives/export.service';


@Component({
  selector: 'app-type-structure',
  templateUrl: './type-structure.component.html',
  styleUrls: ['./type-structure.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TypeStructureComponent extends AbstractSycadTableComponent implements OnInit {

  @ViewChild('datatable1', {read: ViewContainerRef})
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(private _snackBar: MatSnackBar,
                   private mediaObserver: MediaObserver,
              public dialog: MatDialog,
              private compiler: Compiler,
              private injector: Injector,
              private typeStructureService: TypeStructureService)
  { super(); }


  public async loadComponent() {
    this.componentFactories = [];
    const { SycadTableComponent, SycadTableModule } = await import('@sycadApp/libs/sycad-table/sycad-table.component');
    const moduleFactory = SycadTableModule instanceof NgModuleFactory ? SycadTableModule
      : (await this.compiler.compileModuleAsync(SycadTableModule));
    const moduleRef = moduleFactory.create(this.injector);
    const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(SycadTableComponent);
    this.anchor.clear();
    const tableauComponent = this.anchor.createComponent(componentFactory);
    tableauComponent.instance.tableDescription= this.monTableau;
    tableauComponent.instance.backendApiService= this.typeStructureService;
    tableauComponent.instance.actions= this.actions;
    tableauComponent.instance.onEditData.subscribe($event =>  this.modifier($event));
    tableauComponent.instance.onDeleteData.subscribe($event =>  this.supprimer($event));
    tableauComponent.instance.onAddData.subscribe($event =>  this.ajout());
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;

  }

  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des  types de structures",true,false);

    this.monTableau.typeRessource="CategorieStructureResource";

    this.monTableau
      .pushColumn(new SycadTableColonne("nom","Nom",true, TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("description","Description",true,TypeColonne.STRING,true,""))
    this.loadComponent();
  }

  public finishExport(event: StatsExport) {
    this._snackBar.open(`Exportation terminée. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }



  public openFormModal(typeStructure: TypeStructure){


    let { width,height,position}=this.getCorrectWidth();

    this.dialogRef = this.dialog.open(FormTypeStructureComponent, {
      data: typeStructure,
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

  public dialogRef: MatDialogRef<FormTypeStructureComponent,any>;

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
      //console.log("this.activeMediaQuery",this.activeMediaQuery)

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
  public modifier(typeStructure) {
    this.openFormModal(typeStructure);
  }
  public supprimer(data) {
    this.typeStructureService.delete(data.id).subscribe(
      data => {
        this.openSnackBar("Le type de structure est supprimé avec succès","OK");
        this.refeshDataSubject.next("");
      },
      errorResponse => {
        let errorData = errorResponse.error;

       //// console.log(errorData)

        this.openSnackBar("Impossible de supprimer le type de structure","OK");
      }
    );
  }



  public genericAction(context: GenericActionEvent) {
   //// console.log("une action quelconque  ",context)
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
