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
import {MatSnackBar} from '@angular/material/snack-bar';
import {MediaObserver} from '@angular/flex-layout';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import { BaremeImpotService } from '@sycadApp/services/impot/bareme-impot.service';
import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import {BaremeImpot} from '@sycadApp/models/impot/bareme-impot.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-bareme-impot',
  templateUrl: './bareme-impot.component.html',
  styleUrls: ['./bareme-impot.component.scss']
})
export class BaremeImpotComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver,
              public dialog: MatDialog,private compiler: Compiler,
              private injector: Injector,private router: Router,
              private route: ActivatedRoute,public confirmService: AppConfirmService,
              public baremeImpotService: BaremeImpotService)
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
    tableauComponent.instance.backendApiService=this.baremeImpotService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onEditData.subscribe($event =>  this.modifier($event));
    tableauComponent.instance.onDeleteData.subscribe($event =>  this.supprimer($event));
    tableauComponent.instance.onAddData.subscribe($event =>  this.ajout());
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;

  }
  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData('Tableau des baremes impôts',true,false);
    this.monTableau
      .pushColumn(new SycadTableColonne("processus.libelle","Pocessus",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("natureImpot.libelle","Nature impôt",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("taux","Taux",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("valeur","Valeur",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("contribuableType","Type contribuable",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("arrondissement.nom","Arrondissement",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("arrondissement.commune.nom","Commune",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("destination.libelle","Destination",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("degreSuccessoral.libelle","Degré successoral",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("domaine","Domaine",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("etatMev","Etat mise en valeur",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("trancheMin","Tranche minimale",false,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("trancheMax","Tranche maximale",false,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("unite","Unité",true,TypeColonne.STRING,false,""))
      .pushColumn(new SycadTableColonne("cessionSource","Mode cession",true,TypeColonne.STRING,true,""))




      ;

    this.monTableau.typeRessource="BaremeImpotResource";
    this.loadComponent();
  }
  public activeMediaQuery = '';
  ngAfterContentInit() {
  }

  public ajout() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_BAREME_IMPOT}/edition`]);
  }

  public modifier(baremeImpot: BaremeImpot) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_BAREME_IMPOT}/edition`, baremeImpot.id]);

  }
  public supprimer(data) {
    this.baremeImpotService.delete(data.id).subscribe(
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
}
