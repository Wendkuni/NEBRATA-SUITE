import { Compiler, Component, Injector, NgModuleFactory, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettingsService } from '@sycadApp/config/app.settings.service';
import { GenericActionEvent, SycadTableColonne, SycadTableMetaData, TypeColonne } from '@sycadApp/libs/model-table';
import { AbstractSycadTableComponent } from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import { Mandat } from '@sycadApp/models/workflow/common/general';
import { MandatService } from '@sycadApp/services/workflow/mandat.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-mandat',
  templateUrl: './mandat.component.html',
  styleUrls: ['./mandat.component.css']
})
export class MandatComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;
  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(private mediaObserver: MediaObserver, private _snackBar: MatSnackBar,
    public dialog: MatDialog, private compiler: Compiler,
    private injector: Injector,public appSettings: AppSettingsService,
    private router: Router, public mandatService: MandatService,
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
      tableauComponent.instance.backendApiService=this.mandatService;
      tableauComponent.instance.actions=this.actions;
      tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
      tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;

    }

  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des mandats",true,false);
    this.monTableau.typeRessource="MandatResource";
    this.monTableau.isOnlyListing=true;
    this.monTableau.isCreationActive = false;
    this.monTableau.isDeletable = false;
    this.monTableau.isEditable = false;
    this.monTableau.isExpand = true;
    this.monTableau
    .pushColumn(new SycadTableColonne("objet","Objet",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("actif","Statut",true,TypeColonne.BOOLEAN,true,""))
  .pushColumn(new SycadTableColonne("reference","Référence",true,TypeColonne.STRING,true,"",))
  .pushColumn(new SycadTableColonne("pieceJointe","Pièce jointe",true,TypeColonne.LIEN,true,"",))
  .pushColumn(new SycadTableColonne("description","Description",true,TypeColonne.STRING,true,""))
 
  .pushColumn(new SycadTableColonne("mandat.mandataire.nom","Nom",true,TypeColonne.STRING,true,""))
  .pushColumn(new SycadTableColonne("mandat.mandataire.prenoms","Prenom",true,TypeColonne.STRING,true,""))
  .pushColumn(new SycadTableColonne("mandat.mandataire.codeUnique","IFU-Code",true,TypeColonne.STRING,true,""))
  .pushColumn(new SycadTableColonne("mandat.mandataire.lieuNaissance","Lieu de naissance",true,TypeColonne.STRING,true,""))
  .pushColumn(new SycadTableColonne("mandat.mandataire.dateNaissance","Date de naissance",true,TypeColonne.DATE,true,""))
  .pushColumn(new SycadTableColonne("mandat.mandataire.pieceOfficielle.categorie.libelle","Type de pièce",true,TypeColonne.STRING,true,""))
  .pushColumn(new SycadTableColonne("mandat.mandataire.pieceOfficielle.numero","N° Pièce",true,TypeColonne.STRING,true,""))
  .pushColumn(new SycadTableColonne("mandat.mandataire.pieceOfficielle.nip","NIP",true,TypeColonne.STRING,true,""))
  .pushColumn(new SycadTableColonne("mandat.mandataire.pieceOfficielle.dateObtention","Date de la pièce",true,TypeColonne.DATE,true,""))
  .pushColumn(new SycadTableColonne("mandant.libelle","Mandant",true,TypeColonne.STRING,true,""))
  .pushColumn(new SycadTableColonne("debut","Date début",false, TypeColonne.DATE,true,""))
  .pushColumn(new SycadTableColonne("fin","Date fin",false, TypeColonne.DATE,true,""))
   this.loadComponent();
  }
  public activeMediaQuery = '';
  ngAfterContentInit() {
  }



    public supprimer(data) {
      this.mandatService.delete(data.id).subscribe(
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
