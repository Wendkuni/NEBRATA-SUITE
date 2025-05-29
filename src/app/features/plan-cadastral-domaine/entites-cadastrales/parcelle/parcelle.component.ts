import {
  Compiler,
  Component,
  EventEmitter,
  Injector,
  NgModuleFactory,
  OnInit, Output, TemplateRef,
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
import { ParcelleItem } from '@sycadApp/models/data-references/territoire/localite.model';
import { CycledeVieParcelleComponent } from '@sycadApp/shared/form-components/plan-cadastral/cycle-de-vie-parcelle/app-cycledevie-parcelle.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-parcelle',
  templateUrl: './parcelle.component.html',
  styleUrls: ['./parcelle.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ParcelleComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;
  @ViewChild("templateParcelle") tpl: TemplateRef<any>;
  public refeshDataSubject: Subject<string> = new Subject<string>();
  @Output() navigateToDetails = new EventEmitter<void>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor( private mediaObserver: MediaObserver,
               private injector: Injector,
               private compiler: Compiler,
               public parcelleService: ParcelleService,
               public dialog: MatDialog)
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
    tableauComponent.instance.backendApiService=this.parcelleService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.onActionElementData.subscribe($event =>  this.goToDetails($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;

  }

  public dialogRef: MatDialogRef<CycledeVieParcelleComponent,any>;

  goToDetails(parcelle:any) {
    this.navigateToDetails.emit(parcelle);  // Émet un événement pour demander au parent de changer l'onglet
  }
  ouvrirModalCycleDeVie(parcelle:ParcelleItem) {
    let { width,height,position}=this.getCorrectWidth();
    this.dialogRef = this.dialog.open(CycledeVieParcelleComponent, {
     data: parcelle,
     panelClass:"sycad-dialog-form",
     width: width,
     height: height,
     position: position,
     disableClose:true
  })
}
  ngAfterViewInit() {
    this.monTableau.templateExpand= this.tpl;
  }
  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des parcelles",false,false);
    this.monTableau.isCreationActive=false;
    this.monTableau.isDeletable=false;
    this.monTableau.isEditable=false;
    // this.monTableau.actionElement=new ActionElementEvent("Voir cycle de vie",true);;
    this.monTableau.actionElement=new ActionElementEvent("Voir les détails",true, "preview");
    this.monTableau.isOnlyListing=false;
    this.monTableau.typeRessource="ParcelleResource";
    this.monTableau
    .pushColumn(new SycadTableColonne("arrondissement.commune.nom","Commune",true,TypeColonne.STRING,true,"",true))
    .pushColumn(new SycadTableColonne("arrondissement.nom","Arrondissement",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("icad","Icad",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("ilot.section.numero","N° section",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("ilot.section.numeroAncien","N° ancien section",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("ilot.numero","N° ilot",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("ilot.numeroAncien","N° ancien ilot",true,TypeColonne.STRING,true,"",true))

      .pushColumn(new SycadTableColonne("numero","N° parcelle",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("numeroAncien","N° ancien parcelle",true,TypeColonne.STRING,true,"",true))

       .pushColumn(new SycadTableColonne("libelle","Libellé",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("superficie","Superficie",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("destination.libelle","Destination",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("delaiDeMiseEnValeur","Date état mise en valeur",false, TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("etatAttribution","Etat attribution",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("etatMev","Etat",true,TypeColonne.STRING,true,"",true))


      .pushColumn(new SycadTableColonne("domaine","Domaine",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("territoireZone","Zone",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("quartier.nom","Quartier",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("localite.nom","Localité",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("zone.libelle","Arrondissement Zone",true,TypeColonne.STRING,true,"",true));
    this.loadComponent();
  }
  public genericAction(context: GenericActionEvent) {
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
        width: '70vw',
        height: '80vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("lg")) {
      return {
        width: '70vw',
        height: '80vh',
        position: {
          top:'2vh',
        }
      };
    }
    if(this.mediaObserver.isActive("xl")) {
      return {
        width: '70vw',
        height: '80vh',
        position: {
          top:'2vh',
        }
      };
    }
  }
}
