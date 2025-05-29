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
import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import {Civilite} from '@sycadApp/models/data-references/system/model';
import {FormCivilitesComponent} from '@sycadFeature/data-references-domaine/generique-ref/civilites/form-civilites/form-civilites.component';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import { CiviliteService } from '@sycadApp/services/data-references/system/civilite-service.service';
import {StatsExport} from '@sycadShared/directives/export.service';


@Component({
  selector: 'app-civilites',
  templateUrl: './civilites.component.html',
  styleUrls: ['./civilites.component.scss']
})
export class CivilitesComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor( private _snackBar: MatSnackBar,
               private mediaObserver: MediaObserver,
               public dialog: MatDialog,private compiler: Compiler, private injector: Injector,
               public civiliteService: CiviliteService) {super(); }


  public async loadComponent() {
    this.componentFactories = [];
    const { SycadTableComponent,SycadTableModule } = await import('@sycadApp/libs/sycad-table/sycad-table.component');
    const moduleFactory = SycadTableModule instanceof NgModuleFactory ? SycadTableModule
      : (await this.compiler.compileModuleAsync(SycadTableModule));
    const moduleRef = moduleFactory.create(this.injector);
    const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(SycadTableComponent);
    this.anchor.clear();
    const tableauComponent = this.anchor.createComponent(componentFactory);
    tableauComponent.instance.tableDescription=this.monTableau;
    tableauComponent.instance.backendApiService=this.civiliteService;
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
    this.monTableau=new SycadTableMetaData("Tableau des civilités",true,false);
    this.monTableau.typeRessource="CiviliteResource";
    this.monTableau
      .pushColumn(new SycadTableColonne("libelle","Libellé",true,TypeColonne.STRING,true,""))
    this.loadComponent();
  }

  public openFormModal(civilite: Civilite){
    let { width,height,position}=this.getCorrectWidth();
   this.dialogRef = this.dialog.open(FormCivilitesComponent, {
      data: civilite,
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
  public dialogRef: MatDialogRef<FormCivilitesComponent,any>;

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
  public modifier(role) {
    this.openFormModal(role);
  }
  public supprimer(data) {
    this.civiliteService.delete(data.id).subscribe(
      data => {
        this.openSnackBar("La civlité est supprimée avec succès","OK");
        this.refeshDataSubject.next("");
      },
      errorResponse => {
        let errorData = errorResponse.error;

      // // console.log(errorData)

        this.openSnackBar("Impossible de supprimer la civilité","OK");
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
