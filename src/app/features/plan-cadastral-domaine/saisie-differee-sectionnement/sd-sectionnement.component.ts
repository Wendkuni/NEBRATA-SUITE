import {
  Compiler,
  Component, Injector, NgModuleFactory,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {
  AbstractSycadTableComponent
} from "@sycadApp/libs/sycad-table/sycad-table-abstract.component";
import {Subject} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MediaObserver} from "@angular/flex-layout";
import {Router} from "@angular/router";
import {
  AppConfirmService
} from "@sycadShared/app-confirm/app-confirm.service";
import {MatDialog} from "@angular/material/dialog";
import {
  ActionProcessusEvent, GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData, TypeColonne
} from "@sycadApp/libs/model-table";
import {
  StatsExport
} from "@sycadShared/directives/export.service";
import {
  environment
} from "../../../../environments/environment";
import {
  SdSectionnementService
} from "@sycadApp/services/workflow/common/sd-sectionnement.service";
import {
  SdSectionnementElement
} from "@sycadApp/models/workflow/sd-sectionnement.model";

@Component({
  selector: 'app-sd-sectionnement',
  templateUrl: './sd-sectionnement.component.html',
  styleUrls: ['./sd-sectionnement.component.scss']
})
export class SdSectionnementComponent  extends AbstractSycadTableComponent implements OnInit{
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();
  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver,
              private router: Router,
              public confirmService: AppConfirmService,
              public dialog: MatDialog,private compiler: Compiler,
              private injector: Injector, public sdSectionnementService: SdSectionnementService) { super(); }

  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des dossiers de saisie différée sectionnement",true,false);
    this.monTableau
      .pushColumn(new SycadTableColonne("numero", "Dossier", true, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("objet", "Objet", true, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("typeOperation", "Type d'opération", true, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("commune.nom", "Commune", true, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("transmission.transmission", "Structure traitante", true, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("dateModificationDossier","Date de mise à jour",true,TypeColonne.DATETIME,true,""))
      .pushColumn(new SycadTableColonne("etatDossier", "Etat Processus", true, TypeColonne.BOOLEAN, true, ""))
      .pushColumn(new SycadTableColonne("etat", "Etat Dossier", true, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("transmissionCreateur.transmission", "Structure créatrice", false, TypeColonne.STRING, true, ""))
      .pushColumn(new SycadTableColonne("dateCreationDossier", "Date de création", true, TypeColonne.DATETIME, true, ""));


    this.monTableau.typeRessource="DossierSaisieSectionnementResource";
    this.monTableau.isExport=true;

    this.monTableau.transformeToProcessus();


    this.loadComponent();

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
    tableauComponent.instance.backendApiService=this.sdSectionnementService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onAddData.subscribe($event =>  this.actionProcessus(new ActionProcessusEvent(null,null)));
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.onActionProcessu.subscribe($event =>  this.actionProcessus($event));
    tableauComponent.instance.onPreviewData.subscribe($event =>  this.vueMaj($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;
  }

  public finishExport(event: StatsExport) {
    this._snackBar.open(`Export Saisie sectionnement  terminé. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }
  public actionProcessus(context: ActionProcessusEvent) {
    if(context.numero){
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_SECTIONNEMENT}/edition`, context.numero,context.transition.code],{
        state: {
          context
        }
      });
    }else {
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_SECTIONNEMENT}/edition`]);
    }


  }

  public vueMaj(sdSectionnementElement: SdSectionnementElement){
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_SECTIONNEMENT}/view`, sdSectionnementElement.numero]);
  }

  public genericAction(context: GenericActionEvent) {
    // console.log("une action quelconque  ",context)
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top'

    });
  }
}
