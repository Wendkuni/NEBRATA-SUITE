import { RoleItem } from '@sycadApp/models/data-references/security/role.model';
import { RolesService } from '@sycadApp/services/data-references/security/roles-services';
import { environment } from 'environments/environment';
import {
  Compiler,
  Component,
  Injector, NgModuleFactory,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import {Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {
  GenericActionEvent,
  SycadTableColonne,
  SycadTableContext,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import { ProfilItem, ProfilElement} from '@sycadApp/models/data-references/security/profil.model';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import { ProfilesService } from '@sycadApp/services/data-references/security/profiles.service';
import { FormProfilesComponent } from './form-profiles/form-profiles.component';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent extends  AbstractSycadTableComponent implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  isLoadingResults = false;


  search : SycadTableContext<RoleItem> = new SycadTableContext();

  @ViewChild("templateProfile") tpl: TemplateRef<any>;


  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }

  constructor(private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver,
              public dialog: MatDialog,private compiler: Compiler,
              private injector: Injector, public profilesService: ProfilesService,
              private router: Router,
              private roleService: RolesService) {super() }
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
    tableauComponent.instance.backendApiService=this.profilesService;
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
    this.search.page = 0;
    this.monTableau=new SycadTableMetaData("Tableau des profils",true,false);
    this.monTableau.isExpand=true;
    this.monTableau.typeRessource="ProfilResource";

    this.monTableau
      .pushColumn(new SycadTableColonne("libelle","Libellé",true,TypeColonne.STRING,true,"",true))
      .pushColumn(new SycadTableColonne("type","Type",true,TypeColonne.STRING,true,"",true))
    this.loadComponent();

  }


  public openFormModal(profile: ProfilElement){
    let { width,height,position}=this.getCorrectWidth();
     this.dialogRef = this.dialog.open(FormProfilesComponent, {
      data: profile,
       panelClass:"sycad-dialog-form",
       width: width,
       height: height,
       position: position,
       disableClose:true
    });

    this.dialogRef.afterClosed().subscribe(profile => {
      if(profile) {
        this.openSnackBar("Le profil est ajouté avec succès","OK");
        this.refeshDataSubject.next("");
      }

    });

  }
  public dialogRef: MatDialogRef<FormProfilesComponent,any>;

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
      //("this.activeMediaQuery",this.activeMediaQuery)

      if(this.dialogRef) {
        let { width,height,position}=this.getCorrectWidth();
        this.dialogRef.updateSize(width, height);
        this.dialogRef.updatePosition(position);
      }

    });
  }
  public ajout() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.SECURITY_PROFILE}/edition`]);
  }
 
  public modifier(profile: ProfilElement) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.SECURITY_PROFILE}/edition`, profile.id]);
  }



  public supprimer(data) {
    this.profilesService.delete(data.id).subscribe(
      data => {
        this.openSnackBar("Le profil est supprimé avec succès","OK");
        this.refeshDataSubject.next("");
      },
      errorResponse => {
        this.openSnackBar("Impossible de supprimer ce profil","OK");
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
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("sm")) {
      return {
        width: '70vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("md")) {
      return {
        width: '50vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("lg")) {
      return {
        width: '35vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }
    if(this.mediaObserver.isActive("xl")) {
      return {
        width: '30vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }
  }

}
