import {
  Compiler,
  Component,
  Inject,
  Injector,
  Input,
  NgModuleFactory,
  OnInit, TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {AbstractSycadTableComponent} from "@sycadApp/libs/sycad-table/sycad-table-abstract.component";
import {Subject} from "rxjs";
import {MediaObserver} from "@angular/flex-layout";
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import {
  ActionElementEvent,
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from "@sycadApp/libs/model-table";
import { CycleDeVieParcelleService } from '@sycadApp/services/workflow/cycle-de-vie-parcelle.service';
import {environment} from '../../../../../environments/environment';
import {Router} from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';

//reçoit une parcelle en entrée et affiche son cyle de vie sous sycad-table exportable
@Component({
  selector: 'app-cycledevie-parcelle',
  templateUrl: './app-cycledevie-parcelle.component.html',
  styleUrls: ['./app-cycledevie-parcelle.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    CycleDeVieParcelleService
  ]
})
export class CycledeVieParcelleComponent extends AbstractSycadTableComponent implements OnInit  {

  @Input("icad")  icadParcelle:string;

  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;
  @ViewChild("templateParcelle") tpl: TemplateRef<any>;
  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }

  constructor( private mediaObserver: MediaObserver,
    private injector: Injector,
    private compiler: Compiler,
    public cycleDeVieParcelleService: CycleDeVieParcelleService, private router: Router,
    @Inject(MAT_DIALOG_DATA) public parcelle: ParcelleElement,
    public dialogRef: MatDialogRef<CycledeVieParcelleComponent>)
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
  tableauComponent.instance.backendApiService=this.cycleDeVieParcelleService;
  tableauComponent.instance.actions=this.actions;
  tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
  tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;
  tableauComponent.instance.onActionElementData.subscribe($event =>  this.ouvrirLeDossier($event));
    
}

ouvrirLeDossier(cycle:CycleDeVieParcelle) {
  switch (cycle.typeDossier) {
    case "ATTRIBUTION":
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_ATTRIBUTION}/view`, cycle.numeroDossier]);

      break;
    case "CONTRIBUTION_FONCIERE":
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_CONTRIBUTION_FONCIERE}/view`,  cycle.numeroDossier]);
      break;

      break;
    case "DEMANDE_DOCUMENT":
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DEMANDE_DOCUMENT}/view`, cycle.numeroDossier]);
      break;

    case "BORNAGE":
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_BORNAGE_DELIMITATION}/view`, cycle.numeroDossier]);
      break;

    case "FUSION":
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_FUSION}/view`, cycle.numeroDossier]);
      break;

    case "MORCELLEMENT":
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MORCELLEMENT}/view`, cycle.numeroDossier]);
      break;

    case "MAJ":
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MAJ_PLAN_CADASTRE}/view`, cycle.numeroDossier]);
      break;

    case "MUTATION":
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_MUTATION}/view`, cycle.numeroDossier]);
      break;

    case "AFFECTATION":
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_AFFECTATION}/view`, cycle.numeroDossier]);
      break;

    case "RETRAIT":
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_RETRAIT}/view`, cycle.numeroDossier]);
      break;

    case "LOTISSEMENT":
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_LOTISSEMENT}/view`, cycle.numeroDossier]);
      break;

    case "AMENAGEMENT":
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_AMENAGEMENT}/view`, cycle.numeroDossier]);
      break;

    default:
      break;
  }
}
ngAfterViewInit() {
  this.monTableau.templateExpand= this.tpl;
}
ngOnInit(): void {
  if(this.parcelle.icad!=null){
    this.cycleDeVieParcelleService.icad=this.parcelle.icad;
  }
  else
  this.cycleDeVieParcelleService.icad=this.icadParcelle;

  this.monTableau=new SycadTableMetaData("Cycle de vie de la parcelle "+this.icadParcelle,false,false);
  this.monTableau.isCreationActive=false;
  this.monTableau.isDeletable=false;
  this.monTableau.isEditable=false;
  this.monTableau.isOnlyListing=false;
  this.monTableau.actionElement=new ActionElementEvent("Voir le dossier",true);;
  this.monTableau.isExport=true;
  this.monTableau.nestedTable=true;
  this.monTableau.typeRessource="CycleDeVieResource";
  this.monTableau
    .pushColumn(new SycadTableColonne("icad","Icad",true,TypeColonne.STRING,false,"",false))
    .pushColumn(new SycadTableColonne("numeroDossier","numéro dossier",true,TypeColonne.STRING,true,"",true))
    .pushColumn(new SycadTableColonne("libelleProcessus","processus",true,TypeColonne.STRING,true,"",true))
    .pushColumn(new SycadTableColonne("etatProcessusDossier","Etat dossier",false,TypeColonne.STRING,true,"",true))
    .pushColumn(new SycadTableColonne("typeDossier","type dossier",true,TypeColonne.STRING,true,"",true))
    .pushColumn(new SycadTableColonne("traitement","Traitement",true,TypeColonne.STRING,true,"",true))
    .pushColumn(new SycadTableColonne("dateDossier","date dossier",true,TypeColonne.DATETIME,true,"",true))
    .pushColumn(new SycadTableColonne("date","Date",true,TypeColonne.DATETIME,true,"",true))
    .pushColumn(new SycadTableColonne("montantGlobalTitre","Montant titre",true,TypeColonne.STRING,true,"",true))
    .pushColumn(new SycadTableColonne("montantReglement","Montant réglement",true,TypeColonne.STRING,true,"",true))
    .pushColumn(new SycadTableColonne("structureValidateur","Structure",true,TypeColonne.STRING,true,"",true))
  
  this.loadComponent();
}

closeFormModal(){
  this.dialogRef.close(); 
 } 

public genericAction(context: GenericActionEvent) {
}

}


export class CycleDeVieParcelle {
  id : number;
  icad : string;
  numeroDossier: string;
  libelleProcessus: string;
  etatProcessusDossier: string;
  structureValidateur: string;
  typeDossier: string;
  traitement: string;
  dateCreationDossier: Date;
  date: Date;
  montantGlobalTitre:number;
  montantReglement:number;
 
}
