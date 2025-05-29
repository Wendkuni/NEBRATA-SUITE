import {
  Compiler,
  Component,
  Injector,
  NgModuleFactory,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import { DocumentTypeService } from '@sycadApp/services/data-references/system/document-type.service';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-document-type',
  templateUrl: './document-type.component.html',
  styleUrls: ['./document-type.component.scss']
})
export class DocumentTypeComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  @ViewChild("templateDestinationDocumentType") tpl: TemplateRef<any>;

  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }

  constructor(private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver,
              private router: Router,
              private compiler: Compiler,
              private injector: Injector, public documentTypeService: DocumentTypeService)
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
    tableauComponent.instance.backendApiService=this.documentTypeService;
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
    this.monTableau=new SycadTableMetaData('Tableau des types de documents',true,false);
    this.monTableau.isExpand=true;
    this.monTableau
      .pushColumn(new SycadTableColonne("code","Code",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("libelle","Libelle",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("estTitreParcelle","Titre parcelle",true,TypeColonne.BOOLEAN,true,""))
      .pushColumn(new SycadTableColonne("estTitreFoncier","Titre foncier",true,TypeColonne.BOOLEAN,true,""))
      .pushColumn(new SycadTableColonne("actif","Actif",true,TypeColonne.BOOLEAN,true,""))
      .pushColumn(new SycadTableColonne("typeActe","Type acte",true,TypeColonne.STRING,true,""));
    this.monTableau.typeRessource="DocumentTypeResource";
    this.loadComponent();
  }

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }


  public ajout() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_TYPE_DOCUMENT}/edition`]);
  }
  public modifier(documentType) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_TYPE_DOCUMENT}/edition`, documentType.id]);
  }
  public supprimer(data) {
    this.documentTypeService.delete(data.id).subscribe(
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
