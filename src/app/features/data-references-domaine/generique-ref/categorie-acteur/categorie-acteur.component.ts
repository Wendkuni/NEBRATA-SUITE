import {
  Compiler,
  Component,
  Injector,
  NgModuleFactory,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import {Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { CategorieActeurService } from '@sycadApp/services/data-references/system/categorie-acteur.service';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import {CategorieActeur} from '@sycadApp/models/data-references/contribuables/global.model';
import {FormCategorieActeurComponent} from '@sycadFeature/data-references-domaine/generique-ref/categorie-acteur/form-categorie-acteur/form-categorie-acteur.component';
import {MediaChange, MediaObserver} from '@angular/flex-layout';

import {ActivatedRoute, Router} from "@angular/router";
import {AppSettingsService} from "@sycadSetting/app.settings.service";
import {environment} from '../../../../../environments/environment';
import {AppConfirmService} from "@sycadShared/app-confirm/app-confirm.service";
import { TemplateRef } from '@angular/core';
import {StatsExport} from '@sycadShared/directives/export.service';
@Component({
  selector: 'app-categorie-acteur',
  templateUrl: './categorie-acteur.component.html',
  styleUrls: ['./categorie-acteur.component.scss']
})
export class CategorieActeurComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;
  
  @ViewChild("templateCategorieActeur") tpl: TemplateRef<any>;

  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver,
              public dialog: MatDialog,
              private compiler: Compiler,
              private injector: Injector,
              public categorieActeurService: CategorieActeurService,
              public confirmService: AppConfirmService, private router:Router, private route: ActivatedRoute, public appSettings: AppSettingsService)
  { super();
  
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
    tableauComponent.instance.backendApiService=this.categorieActeurService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onEditData.subscribe($event =>  this.modifier($event));
    tableauComponent.instance.onDeleteData.subscribe($event =>  this.supprimer($event));
    tableauComponent.instance.onAddData.subscribe($event =>  this.ajout());
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;

  }

  public finishExport(event: StatsExport) {
    this._snackBar.open(`Exportation terminée. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }
  ngAfterViewInit() {
    this.monTableau.templateExpand= this.tpl;
  }
  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des catégories d'acteurs",true,false);
    this.monTableau.isExpand=true;
    this.monTableau.typeRessource="CategorieActeurResource";

    this.monTableau
      .pushColumn(new SycadTableColonne("libelle","Libellé",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("code","Code",true,TypeColonne.STRING,true,""))
    this.loadComponent();
  }

  public openFormModal(categorieActeur: CategorieActeur){
    let { width,height,position}=this.getCorrectWidth();

    this.dialogRef = this.dialog.open(FormCategorieActeurComponent, {
      data: categorieActeur,
      panelClass:"sycad-dialog-form",
      width: width,
      height: height,
      position: position,
      disableClose:true
    });

    this.dialogRef.afterClosed().subscribe(role => {
      if(role) {
        // this.openSnackBar("La catégorie de l'acteur est  ajoutée avec succès","OK");
        this.refeshDataSubject.next("");
      }

    });

  }
  public dialogRef: MatDialogRef<FormCategorieActeurComponent,any>;

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
     //// console.log("this.activeMediaQuery",this.activeMediaQuery)

      if(this.dialogRef) {
        let { width,height,position}=this.getCorrectWidth();
        this.dialogRef.updateSize(width, height);
        this.dialogRef.updatePosition(position);
      }

    });
  }
  public ajout() {
    /* this.openFormModal(null); */
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_CATEGORIE_ACTEUR}/edition`]);
  }
  public modifier(categorieActeur: CategorieActeur) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_CATEGORIE_ACTEUR}/edition`,categorieActeur.id]);
  }
  public supprimer(data) {
    this.categorieActeurService.delete(data.id).subscribe(
      data => {
        this.openSnackBar("La catégorie de l'acteur est supprimée avec succès","OK");
        this.refeshDataSubject.next("");
      },
      errorResponse => {
        let errorData = errorResponse.error;

      // // console.log(errorData)

        this.openSnackBar("Impossible de supprimer la catégorie de l'acteur","OK");
      }
    );
  }



  public genericAction(context: GenericActionEvent) {
   //// console.log("une action quelconque  ",context)
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
        width: '50vw',
        height: '60vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("lg")) {
      return {
        width: '35vw',
        height: '60vh',
        position: {
          top:'2vh',
        }
      };
    }
    if(this.mediaObserver.isActive("xl")) {
      return {
        width: '30vw',
        height: '60vh',
        position: {
          top:'2vh',
        }
      };
    }
  }


}
