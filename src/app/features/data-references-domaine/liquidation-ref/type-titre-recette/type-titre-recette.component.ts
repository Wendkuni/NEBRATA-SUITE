import {
  Compiler,
  Component,
  Injector, NgModuleFactory,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { TypeTitreRecetteService } from '@sycadApp/services/impot/type-titre-recette.service';
import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import {TypeTitreRecette} from '@sycadApp/models/impot/type-titre-recette.model';
import { FormTypeTitreRecetteComponent } from './form-type-titre-recette/form-type-titre-recette.component';
@Component({
  selector: 'app-type-titre-recette',
  templateUrl: './type-titre-recette.component.html',
  styleUrls: ['./type-titre-recette.component.scss']
})
export class TypeTitreRecetteComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  @ViewChild("templateTypeTitreRecette") tpl: TemplateRef<any>;

  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver,
              public dialog: MatDialog, private compiler: Compiler,
              private injector: Injector, public typeTitreRecetteService: TypeTitreRecetteService)
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
    tableauComponent.instance.backendApiService=this.typeTitreRecetteService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onEditData.subscribe($event =>  this.modifier($event));
    tableauComponent.instance.onDeleteData.subscribe($event =>  this.supprimer($event));
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;

  }
  ngAfterViewInit() {
    this.monTableau.templateExpand= this.tpl;
  }
  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des types de titre de recette",false,false);
    this.monTableau.isCreationActive=false;
    this.monTableau.isDeletable=false;
    this.monTableau.isEditable=true;
    this.monTableau.isExpand=true;

    this.monTableau.typeRessource="TypeTitreRecetteResource";
    this.monTableau
      .pushColumn(new SycadTableColonne("code","Code",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("libelle","Libellé",true,TypeColonne.STRING,true,"",true));
    this.loadComponent();
  }

  public openFormModal(typeTitrerRecette: TypeTitreRecette){
    let { width,height,position}=this.getCorrectWidth();

    this.dialogRef = this.dialog.open(FormTypeTitreRecetteComponent, {
      data: typeTitrerRecette,
      panelClass:"sycad-dialog-form",
      width: width,
      height: height,
      position: position,
      disableClose:true
    });

    this.dialogRef.afterClosed().subscribe(role => {
      if(role) {
        this.openSnackBar("Element ajouté avec succès","OK");
        this.refeshDataSubject.next("");
      }

    });

  }
  public dialogRef: MatDialogRef<FormTypeTitreRecetteComponent,any>;

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
  public modifier(typeTitrerRecette) {
    this.openFormModal(typeTitrerRecette);
  }
  public supprimer(data) {
    this.typeTitreRecetteService.delete(data.id).subscribe(
      data => {
        this.openSnackBar("Element supprimé avec succès","OK");
        this.refeshDataSubject.next("");
      },
      errorResponse => {
        let errorData = errorResponse.error;


        this.openSnackBar("Impossible de supprimer cet élément","OK");
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
