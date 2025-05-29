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
import { MediaObserver} from '@angular/flex-layout';
import {MatDialog} from '@angular/material/dialog';
import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import { PackageImpotService } from '@sycadApp/services/impot/package-impot.service';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import {PackageImpot} from '@sycadApp/models/impot/package-impot.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import { environment } from 'environments/environment';
import { TemplateRef } from '@angular/core';

@Component({
  selector: 'app-package-impot',
  templateUrl: './package-impot.component.html',
  styleUrls: ['./package-impot.component.scss']
})
export class PackageImpotComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();
  @ViewChild("templatePackageImpot") tpl: TemplateRef<any>;

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor( private _snackBar: MatSnackBar,
               private mediaObserver: MediaObserver,
               private router: Router,
               public dialog: MatDialog,private compiler: Compiler,
               public confirmService: AppConfirmService,
               private injector: Injector, public packageImpotService: PackageImpotService)
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
    tableauComponent.instance.backendApiService=this.packageImpotService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onEditData.subscribe($event =>  this.modifier($event));
    tableauComponent.instance.onDeleteData.subscribe($event =>  this.supprimer($event));
    tableauComponent.instance.onAddData.subscribe($event =>  this.ajout());
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;

  }
  ngAfterViewInit() {
    this.monTableau.templateExpand= this.tpl;
  }
  ngOnInit(): void {
    this.monTableau= new SycadTableMetaData("Tableau des packages impôts",true,false);
    this.monTableau.isExpand=true;
    this.monTableau
      .pushColumn(new SycadTableColonne("processus.libelle","Processus",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("code","Code",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("actif","Actif",true,TypeColonne.BOOLEAN,true,""))
      .pushColumn(new SycadTableColonne("parDefaut","Par défaut",true,TypeColonne.BOOLEAN,true,""))
      .pushColumn(new SycadTableColonne("libelle","Libellé",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("dateDebut","Date début",true, TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("dateFin","Date fin",true, TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("unite","Unité",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("typeContribuable","Type Contribuable",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("delaiReglementMois","Délais de règlement",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("tauxPenaliteHorsDelai","Taux de pénalité ",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("periodeInteretSurPenalite","Période interêt sur pénalité",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("tauxInteretSurPenalite","Taux interêt sur pénalité ",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("refLoi","Référence loi",false,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("natureImpot.libelle","Nature d'impôt",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("observation","Observation",false,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("ordreTri","Ordre",false,TypeColonne.STRING,true,""));



    this.monTableau.typeRessource="PackageImpotResource";
    this.loadComponent();
  }

  public activeMediaQuery = '';
  ngAfterContentInit() {

  }
  public ajout() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_PACKAGE_IMPOT}/edition`]);
  }

  public modifier(packageImpot: PackageImpot) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_PACKAGE_IMPOT}/edition`, packageImpot.id]);
  }

  public supprimer(data) {
    this.packageImpotService.delete(data.id).subscribe(
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
