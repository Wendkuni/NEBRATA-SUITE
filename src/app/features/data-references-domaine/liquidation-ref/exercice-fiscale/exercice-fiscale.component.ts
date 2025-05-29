import {
  Compiler,
  Component,
  Injector,
  NgModuleFactory,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Subject, timeout} from 'rxjs';
import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { ExerciceFiscaleService } from '@sycadApp/services/impot/exercice-fiscale.service';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import {ExerciceFiscale} from '@sycadApp/models/impot/exercice-fiscale.model';
import { FormExerciceFiscaleComponent } from './form-exercice-fiscale/form-exercice-fiscale.component';
import { SycadUtils } from '@sycadApp/shared/utils.functions';

@Component({
  selector: 'app-exercice-fiscale',
  templateUrl: './exercice-fiscale.component.html',
  styleUrls: ['./exercice-fiscale.component.scss']
})
export class ExerciceFiscaleComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;
  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver,
              public dialog: MatDialog, private compiler: Compiler,
              private injector: Injector, public exerciceFiscaleService: ExerciceFiscaleService)
  {
    super();
  }
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
    tableauComponent.instance.backendApiService=this.exerciceFiscaleService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onEditData.subscribe($event =>  this.modifier($event));
    tableauComponent.instance.onDeleteData.subscribe($event =>  this.supprimer($event));
    tableauComponent.instance.onAddData.subscribe($event => this.ajout());
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.refeshDataSubject= this.refeshDataSubject;

  }
  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des exercices fiscaux",true,false);
    this.monTableau
      .pushColumn(new SycadTableColonne("annee","Année",true, TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("libelle","Libellé",true, TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("datedebut","Date début",true, TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("datefin","Date fin",true, TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("etat","Etat exercice fiscal",true, TypeColonne.STRING,true,"",true));

    this.loadComponent();
    this.monTableau.typeRessource="ExerciceFiscaleResource";
  }
  public openFormModal(exerciceFiscale: ExerciceFiscale){
    let { width,height,position}=this.getCorrectWidth();

    this.dialogRef = this.dialog.open(FormExerciceFiscaleComponent, {
      data: exerciceFiscale,
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
  public isLoadingResults:Boolean = false;
  public sync() {
   // console.log("sync depuis syntax");
    this.isLoadingResults=true;

    this.exerciceFiscaleService.syncFromSintax().pipe( timeout(30*60*1000)).subscribe(response => {
      this.isLoadingResults=false;
          if(response.status===200) {
            this.openSnackBar("Les données d'exercices fiscales ont été bien synchronisées", "OK");
          }else {
            let mes= {
              message:"La requête de synchronisation de s'est pas bien passé"
            }
            SycadUtils.notifyRemoteError(mes, this._snackBar);
          }
          this.refeshDataSubject.next("");
      },
      errorResponse =>{
        this.isLoadingResults=false;
        let mes= {
          message:"La requête de synchronisation de s'est pas bien passé"
        }
        SycadUtils.notifyRemoteError(mes, this._snackBar);
      }
    );
  }
  public dialogRef: MatDialogRef<FormExerciceFiscaleComponent,any>;

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
  public modifier(exerciceFiscale) {
    this.openFormModal(exerciceFiscale);
  }

  public genericAction(context: GenericActionEvent) {

  }
  public supprimer(data) {
    this.exerciceFiscaleService.delete(data.id).subscribe(
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
