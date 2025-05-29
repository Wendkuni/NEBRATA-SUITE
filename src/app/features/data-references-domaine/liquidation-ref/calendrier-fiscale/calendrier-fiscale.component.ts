import { NgModuleFactory } from '@angular/core';
import { Compiler, Component, Injector, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SycadTableMetaData, SycadTableColonne, TypeColonne, GenericActionEvent } from '@sycadApp/libs/model-table';
import { AbstractSycadTableComponent } from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import { CalendrierFiscaleService } from '@sycadApp/services/impot/calendrier-fiscale.service';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { Subject, timeout } from 'rxjs';

@Component({
  selector: 'app-calendrier-fiscale',
  templateUrl: './calendrier-fiscale.component.html',
  styleUrls: ['./calendrier-fiscale.component.scss']
})
export class CalendrierFiscaleComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(
    private injector: Injector,
    private _snackBar: MatSnackBar,
    private compiler: Compiler,
    private calendrierFiscaleService: CalendrierFiscaleService) {
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
    tableauComponent.instance.backendApiService=this.calendrierFiscaleService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;

  }
  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des calendriers fiscaux",false,false);
    this.monTableau.isCreationActive=false;
    this.monTableau.isDeletable=false;
    this.monTableau.isEditable=false;
    this.monTableau.isOnlyListing=true;

    this.monTableau.typeRessource="CalendrierFiscaleResource";
    this.monTableau
      .pushColumn(new SycadTableColonne("idSintax","ID sintax",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("libelle","Libellé",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("dateButoir","Date butoir",true,TypeColonne.DATE,true,"",true))
      .pushColumn(new SycadTableColonne("exerciceFiscale.annee","Exercice fiscale",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("natureImpot.libelle","Nature impôt",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("datedebut","Date de début",true,TypeColonne.DATE,true,"",true))
      .pushColumn(new SycadTableColonne("datefin","Date fin",true,TypeColonne.DATE,true,"",true));
    this.loadComponent();
  }
  public genericAction(context: GenericActionEvent) {

  }

  public isLoadingResults:Boolean = false;
  public sync() {
   // console.log("sync depuis syntax");
    this.isLoadingResults=true;

    this.calendrierFiscaleService.syncFromSintax().pipe( timeout(30*60*1000)).subscribe(response => {
      this.isLoadingResults=false;
          if(response.status===200) {
            this.openSnackBar("Les données sur les calendriers fiscaux ont été bien synchronisés", "OK");
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top'

    });
  }
  }


