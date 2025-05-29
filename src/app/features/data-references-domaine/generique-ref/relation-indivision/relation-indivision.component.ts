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
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from "@sycadApp/libs/model-table";
import {AbstractSycadTableComponent} from "@sycadApp/libs/sycad-table/sycad-table-abstract.component";
import { IndivisionrelationService } from '@sycadApp/services/data-references/contribuables/indivisionRelation.service';
import {FormIndivisionRelationComponent} from '@sycadFeature/data-references-domaine/generique-ref/relation-indivision/form-indivision/form-indivisionRelation.component';
import { IndivisionRelationElement } from '@sycadApp/models/data-references/system/indivision-relation.model';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {FormTypeStructureComponent} from '@sycadApp/features/data-references-domaine/organigramme-ref/type-structure/form-type-structure/form-type-structure.component';
import {StatsExport} from '@sycadShared/directives/export.service';

@Component({
  selector: 'app-relation-indivision',
  templateUrl: './relation-indivision.component.html',
  styleUrls: ['./relation-indivision.component.scss']
})
export class RelationIndivisionComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  @ViewChild("templateIndivisionQualite") tpl: TemplateRef<any>;

  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }

  constructor(
    private _snackBar: MatSnackBar,
    private mediaObserver: MediaObserver,
    public dialog: MatDialog,private compiler: Compiler,
    private injector: Injector,public indivisionrelationService :IndivisionrelationService
  )
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
    tableauComponent.instance.tableDescription=this.monTableau;
    tableauComponent.instance.backendApiService=this.indivisionrelationService;
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
    this.monTableau= new SycadTableMetaData("Tableau des relations indivisions",true,false);
    this.monTableau.isExpand = true;
    this.monTableau
      .pushColumn(new SycadTableColonne("libelle","libelle",true,TypeColonne.STRING,true,""))
    this.loadComponent();
  }
  public openFormModal(indivisionRelation: IndivisionRelationElement){
    let { width,height,position}=this.getCorrectWidth();
    this.dialogRef = this.dialog.open(FormIndivisionRelationComponent, {
      data: indivisionRelation,
      panelClass:"sycad-dialog-form",
      width: width,
      height: height,
      position: position,
      disableClose:true
    });

    this.dialogRef.afterClosed().subscribe(indivisionRelation => {
      if(indivisionRelation) {
        // this.openSnackBar("Element ajouté avec succès","OK");
        this.refeshDataSubject.next("");
      }

    });

  }
  public dialogRef: MatDialogRef<FormIndivisionRelationComponent,any>;

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

  public finishExport(event: StatsExport) {
    this._snackBar.open(`Exportation terminée. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }
  public ajout() {
    this.openFormModal(null);
  }
  public modifier(indivisionRelation) {
    this.indivisionrelationService.get(indivisionRelation.id).subscribe(indivisionElement => {
        this.openFormModal(indivisionElement);
      },
      errorResponse => {
        this.openSnackBar("Impossible de récupérer la relation d'indivision depuis le serveur","OK");
      })

  }
  public supprimer(data) {
    this.indivisionrelationService.delete(data.id).subscribe(
      data => {
        this.openSnackBar("la relation d'indivision est supprimée avec succès","OK");
        this.refeshDataSubject.next("");
      },
      errorResponse => {
        let errorData = errorResponse.error;
        this.openSnackBar("Impossible de supprimer la relation d'indivision","OK");
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
