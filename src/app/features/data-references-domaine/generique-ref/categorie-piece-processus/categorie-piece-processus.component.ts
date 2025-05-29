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
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { CategoriePieceProcessusService } from '@sycadApp/services/workflow/categorie-piece-processus.service';


import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import {CategoriePieceProcessus} from '@sycadApp/models/workflow/common/general';
import {FormCategoriePieceProcessusComponent} from '@sycadFeature/data-references-domaine/generique-ref/categorie-piece-processus/form-categorie-piece-processus/form-categorie-piece-processus.component';
import {StatsExport} from '@sycadShared/directives/export.service';

@Component({
  selector: 'app-categorie-piece-processus',
  templateUrl: './categorie-piece-processus.component.html',
  styleUrls: ['./categorie-piece-processus.component.scss']
})
export class CategoriePieceProcessusComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver,
              public dialog: MatDialog,private compiler: Compiler,
              private injector: Injector, public categoriePieceServcie: CategoriePieceProcessusService)
  {
    super();
  }
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
    tableauComponent.instance.backendApiService=this.categoriePieceServcie;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onEditData.subscribe($event =>  this.modifier($event));
    tableauComponent.instance.onDeleteData.subscribe($event =>  this.supprimer($event));
    tableauComponent.instance.onAddData.subscribe($event =>  this.ajout());
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;

  }
  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData('Tableau des catégories des pièces des processus',true,false);
    this.monTableau
      .pushColumn(new SycadTableColonne("categoriePiece.libelle","Catégorie de pièce",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("nbExemplaire","Nombre d'exemplaire",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("obligatoire","Obligatoire",true,TypeColonne.BOOLEAN,true,""));

    this.monTableau.typeRessource="CategoriePieceProcessusResource";
    this.loadComponent();
  }

  public finishExport(event: StatsExport) {
    this._snackBar.open(`Exportation terminée. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }
  public openFormModal(categoriePieceProcessus: CategoriePieceProcessus ){
    let { width,height,position}=this.getCorrectWidth();
    this.dialogRef = this.dialog.open(FormCategoriePieceProcessusComponent, {
      data: categoriePieceProcessus,
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


  public dialogRef: MatDialogRef<FormCategoriePieceProcessusComponent,any>;

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
  public modifier(categoriePieceProcessus) {
    this.categoriePieceServcie.get(categoriePieceProcessus.id).subscribe(categoriePieceProcessus => {
        this.openFormModal(categoriePieceProcessus);
      },
      errorResponse => {
        this.openSnackBar("Impossible de récupérer la catégorie  de pièce du processus depuis le serveur","OK");
      })

  }

  public supprimer(data) {
    this.categoriePieceServcie.delete(data.id).subscribe(
      data => {
        this.openSnackBar("la catégorie de pièce du processus est supprimée avec succès","OK");
        this.refeshDataSubject.next("");
      },
      errorResponse => {
        let errorData = errorResponse.error;

        //console.log(errorData)

        this.openSnackBar("Impossible de supprimer la catégorie de pièce du processus","OK");
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
