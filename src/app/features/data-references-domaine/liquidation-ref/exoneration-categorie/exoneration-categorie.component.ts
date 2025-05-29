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
import {MediaObserver} from '@angular/flex-layout';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import { ExonerationCategorieService } from '@sycadApp/services/evaluation/exoneration-categorie.service';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';

import {ExonerationCategorie} from '@sycadApp/models/evaluation/exoneration-categorie.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-exoneration-categorie',
  templateUrl: './exoneration-categorie.component.html',
  styleUrls: ['./exoneration-categorie.component.scss']
})
export class ExonerationCategorieComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver,
              public dialog: MatDialog, private compiler: Compiler,
              private injector: Injector, private router: Router,
              private route: ActivatedRoute, public confirmService: AppConfirmService,
              public exonerationCategorieService: ExonerationCategorieService)
  {
    super();
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
    tableauComponent.instance.backendApiService=this.exonerationCategorieService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onEditData.subscribe($event =>  this.modifier($event));
    tableauComponent.instance.onDeleteData.subscribe($event =>  this.supprimer($event));
    tableauComponent.instance.onAddData.subscribe($event =>  this.ajout());
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;

  }
  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData('Tableau des catégories des exonerations',true,false);
     this.monTableau
      .pushColumn(new SycadTableColonne("code","Code",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("motif","Motif",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("taux","Taux",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("montant","Montant",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("refLoi","Référence loi",true,TypeColonne.STRING,true,""))
       .pushColumn(new SycadTableColonne("codeProcessus","Processus",false,TypeColonne.STRING,true,""))
       .pushColumn(new SycadTableColonne("etatMev","Etat de mise en oeuvre",false,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne(" actif","Actif",true,TypeColonne.BOOLEAN,true,""));

    this.monTableau.typeRessource="ExonerationCategorieResource";
    this.loadComponent();
  }
  public activeMediaQuery = '';
  ngAfterContentInit() {
  }

  public ajout() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_EXONERATION_CATEGORIE}/edition`]);
  }

  public modifier(exonerationCategorie: ExonerationCategorie) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_EXONERATION_CATEGORIE}/edition`, exonerationCategorie.id]);

  }
  public supprimer(data) {
    this.exonerationCategorieService.delete(data.id).subscribe(
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
