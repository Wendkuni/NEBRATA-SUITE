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
import { ParcelleBaremeService } from '@sycadApp/services/evaluation/parcelle-bareme.service';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import {ParcelleBareme} from '@sycadApp/models/cession-parcelle/parcelle-bareme.model';
import { FormParcelleBaremeComponent } from './form-parcelle-bareme/form-parcelle-bareme.component';
@Component({
  selector: 'app-parcelle-bareme',
  templateUrl: './parcelle-bareme.component.html',
  styleUrls: ['./parcelle-bareme.component.scss']
})
export class ParcelleBaremeComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver,
              public dialog: MatDialog,private compiler: Compiler,
              private injector: Injector, public parcelleBaremeService: ParcelleBaremeService)
  {super(); }
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
    tableauComponent.instance.backendApiService=this.parcelleBaremeService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onEditData.subscribe($event =>  this.modifier($event));
    tableauComponent.instance.onDeleteData.subscribe($event =>  this.supprimer($event));
    tableauComponent.instance.onAddData.subscribe($event =>  this.ajout());
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;

  }
  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData('Tableau des barêmes sur les parcelles',true,false);
    this.monTableau
      .pushColumn(new SycadTableColonne("valeur","Valeur",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("arrondissement.commune.nom","Commune",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("arrondissement.nom","Arrondissement",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("arrondissementZone.libelle","Zone Arrondissement",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("destination.libelle","Destination de la parcelle",true,TypeColonne.STRING,true,""));
    this.monTableau.typeRessource="ParcelleBaremeResource";
    this.loadComponent();
  }
  public openFormModal(parcelleBareme: ParcelleBareme){
    let { width,height,position}=this.getCorrectWidth();
    this.dialogRef = this.dialog.open(FormParcelleBaremeComponent, {
      data: parcelleBareme,
      panelClass:"sycad-dialog-form",
      width: width,
      height: height,
      position: position,
      disableClose:true
    });

    this.dialogRef.afterClosed().subscribe(parcelleBareme => {
      if(parcelleBareme) {
        this.openSnackBar("Element ajouté avec succès","OK");
        this.refeshDataSubject.next("");
      }

    });
  }
  public dialogRef: MatDialogRef<FormParcelleBaremeComponent,any>;

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
  public modifier(parcelleBareme) {
    this.openFormModal(parcelleBareme);
  }
  public supprimer(data) {
    this.parcelleBaremeService.delete(data.id).subscribe(
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
