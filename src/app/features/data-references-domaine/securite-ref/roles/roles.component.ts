import { Compiler, Component, ComponentFactory, Injector, NgModuleFactory, Type, ViewChild, ViewContainerRef, OnInit, TemplateRef } from '@angular/core';
import { SycadTableMetaData, SycadTableColonne, TypeColonne, GenericActionEvent, GenericAction } from '@sycadApp/libs/model-table';
import { AbstractSycadTableComponent } from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import { RolesService } from '@sycadApp/services/data-references/security/roles-services';
import { FormRoleComponent } from './form-role/form-role.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { RoleElement } from '@sycadApp/models/data-references/security/role.model';
import {MediaChange, MediaObserver} from '@angular/flex-layout';








@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent extends AbstractSycadTableComponent implements OnInit {

  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  @ViewChild("templateRole") tpl: TemplateRef<any>;



  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }

  constructor( private _snackBar: MatSnackBar,
               private mediaObserver: MediaObserver,
               public dialog: MatDialog,
               private compiler: Compiler, private injector: Injector,
               public rolesService : RolesService) {
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
    tableauComponent.instance.backendApiService=this.rolesService;
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
  ngOnInit():void {
    this.monTableau=new SycadTableMetaData("Tableau des roles",true,false);
    this.monTableau.isExpand=true;
    this.monTableau.typeRessource="RoleResource";
    this.monTableau
    .pushColumn(new SycadTableColonne("code","Code technique",true,TypeColonne.STRING,true,"",true))
    .pushColumn(new SycadTableColonne("libelle","Libellé",true,TypeColonne.STRING,true,"",true))
    //.pushColumn(new SycadTableColonne("locked","Verrouillé",true,TypeColonne.BOOLEAN,true,null,true))
    .pushColumn(new SycadTableColonne("type","Type",true,TypeColonne.STRING,true,"",true));
    this.loadComponent();
    }



    public openFormModal(role: RoleElement){
      let { width,height,position}=this.getCorrectWidth();
       this.dialogRef = this.dialog.open(FormRoleComponent, {
          data: role,
         panelClass:"sycad-dialog-form",
         width: width,
         height: height,
         position: position,
         disableClose:true

      });

      this.dialogRef.afterClosed().subscribe(role => {
        if(role) {
          this.openSnackBar("Le role est ajouté avec succès","OK");
          this.refeshDataSubject.next("");
        }

    });

    }
  public dialogRef: MatDialogRef<FormRoleComponent,any>;

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
      //console.log("this.activeMediaQuery",this.activeMediaQuery)

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
public modifier(role) {
  this.rolesService.get(role.id).subscribe(roleElement => {
    this.openFormModal(roleElement);
  },
  errorResponse => {
    this.openSnackBar("Impossible de récupérer le role depuis le serveur","OK");
  })

}
 public supprimer(data) {
  this.rolesService.delete(data.id).subscribe(
    data => {
      this.openSnackBar("Le role supprimé avec succès","OK");
        this.refeshDataSubject.next("");
    },
    errorResponse => {
      this.openSnackBar("Impossible de supprimer le role","OK");
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
