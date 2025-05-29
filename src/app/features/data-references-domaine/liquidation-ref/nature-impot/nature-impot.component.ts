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
import { NatureImpotService } from '@sycadApp/services/impot/nature-impot.service';
import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import {NatureImpot} from '@sycadApp/models/impot/nature-impot.model';
import { FormNatureImpotComponent } from './form-nature-impot/form-nature-impot.component';

@Component({
  selector: 'app-nature-impot',
  templateUrl: './nature-impot.component.html',
  styleUrls: ['./nature-impot.component.scss']
})
export class NatureImpotComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;


  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver,
              public dialog: MatDialog, private compiler: Compiler,
              private injector: Injector, public natureImpotService: NatureImpotService)
  { super();}
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
    tableauComponent.instance.backendApiService=this.natureImpotService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onEditData.subscribe($event =>  this.modifier($event));
    tableauComponent.instance.onDeleteData.subscribe($event =>  this.supprimer($event));
    tableauComponent.instance.onAddData.subscribe($event => this.ajout());
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.refeshDataSubject= this.refeshDataSubject;

  }

  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des gestions",false,false);
    this.monTableau.typeRessource="NatureImpotResource";

    this.monTableau
      .pushColumn(new SycadTableColonne("code","Code",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("libelle","Libellé",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("typeNatureImpot","Type nature impôt",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("codeSI.libelle","Code système imposition",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("libelleCourt","Libellé court nature impôt",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("ordre","Ordre ",true,TypeColonne.STRING,true,"",true));
    this.loadComponent();
  }
  public openFormModal(natureImpot: NatureImpot){
    let { width,height,position}=this.getCorrectWidth();

    this.dialogRef = this.dialog.open(FormNatureImpotComponent, {
      data: natureImpot,
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
  public dialogRef: MatDialogRef<FormNatureImpotComponent,any>;

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

public ajout(){
    this.openFormModal(null);
}
  public modifier(natureImpot) {
    this.openFormModal(natureImpot);
  }


  public supprimer(data) {
    this.natureImpotService.delete(data.id).subscribe(
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
