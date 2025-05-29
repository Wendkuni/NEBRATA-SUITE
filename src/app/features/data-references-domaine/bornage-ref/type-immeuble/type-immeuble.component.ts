import {
  Compiler,
  Component,
  Injector,
  NgModuleFactory,
  OnInit, TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MediaChange, MediaObserver} from '@angular/flex-layout';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { TypeImmeubleService } from '@sycadApp/services/bornage/type-immeuble.service';
import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import {StatsExport} from '@sycadShared/directives/export.service';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import {TypeImmeuble} from '@sycadApp/models/bornage/type-immeuble.model';
import {ActivatedRoute, Router} from "@angular/router";
import {AppConfirmService} from "@sycadShared/app-confirm/app-confirm.service";
import { environment } from 'environments/environment';
import { FormTypeImmeubleComponent } from './form-type-immeuble/form-type-immeuble.component';

@Component({
  selector: 'app-type-immeuble',
  templateUrl: './type-immeuble.component.html',
  styleUrls: ['./type-immeuble.component.scss']
})
export class TypeImmeubleComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;
  @ViewChild("templateTypeImmeuble") tpl: TemplateRef<any>;

  public refeshDataSubject: Subject<string> = new Subject<string>();
  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver,
              public dialog: MatDialog,private compiler: Compiler,
              private injector: Injector, public typeImmeubleService: TypeImmeubleService,
              private router: Router,
              private route: ActivatedRoute,public confirmService: AppConfirmService)
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
    tableauComponent.instance.backendApiService=this.typeImmeubleService;
    tableauComponent.instance.onEditData.subscribe($event =>  this.modifier($event));
    tableauComponent.instance.onDeleteData.subscribe($event =>  this.supprimer($event));
    tableauComponent.instance.onAddData.subscribe($event =>  this.ajout());
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;
  }

  public finishExport(event: StatsExport) {
    this._snackBar.open(`Export type immeuble terminé. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }
  ngAfterViewInit() {
    this.monTableau.templateExpand= this.tpl;
  }

  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des types d'immeubles",true,false);
    this.monTableau
      .pushColumn(new SycadTableColonne("categorie","Catégorie immeuble",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("code","Code",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("libelle","Libellé",true,TypeColonne.STRING,true,""));
    this.monTableau.typeRessource="TypeImmeubleResource";
   
    this.loadComponent();
  }


  public openFormModal(typeImmeuble: TypeImmeuble){
    let { width,height,position}=this.getCorrectWidth();
     this.dialogRef = this.dialog.open(FormTypeImmeubleComponent, {
      data: typeImmeuble,
       panelClass:"sycad-dialog-form",
       width: width,
       height: height,
       position: position,
       disableClose:true
    });
    this.dialogRef.afterClosed().subscribe(commune => {
      if(commune) {
        this.openSnackBar("Element ajouté avec succès","OK");
        this.refeshDataSubject.next("");
      }

    });

  }

  public dialogRef: MatDialogRef<FormTypeImmeubleComponent,any>;

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
    this.openFormModal(null);
  }

  public modifier(typeImmeuble) {
    this.typeImmeubleService.get(typeImmeuble.id).subscribe(typeImmeuble => {
      this.openFormModal(typeImmeuble);
    },
    errorResponse => {
      this.openSnackBar("Impossible de récupérer l'élément type immeuble depuis le serveur","OK");
    })

  }

  public supprimer(data) {
    this.typeImmeubleService.delete(data.id).subscribe(
      data => {
        this.openSnackBar("Element supprimé avec succès","OK");
        this.refeshDataSubject.next("");
      },
      errorResponse => {
        let errorData = errorResponse.error;

       //// console.log(errorData)

        this.openSnackBar("Impossible de supprimer cet élément","OK");
      }
    );
  }

  public genericAction(context: GenericActionEvent) {
    // // console.log("une action quelconque  ",context)
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
