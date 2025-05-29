import {
  Compiler,
  Component,
  Injector,
  NgModuleFactory,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {Subject} from 'rxjs';
import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {MatDialog} from '@angular/material/dialog';

import {
  ActionProcessusEvent,
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import {StatsExport} from '@sycadShared/directives/export.service';

import {AffectationParcelle} from '@sycadApp/models/workflow/sd-affectation.model';
import { SdAffectationService } from '@sycadApp/services/workflow/sd-affectation.service';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-plan-cadastral-sd-attribution',
  templateUrl: './sd-affectation.component.html',
  styleUrls: ['./sd-affectation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SdAffectationComponent extends AbstractSycadTableComponent  implements OnInit {


  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();
  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor( private _snackBar: MatSnackBar,
               private router: Router,
               public confirmService: AppConfirmService,
               public dialog: MatDialog,private compiler: Compiler,
               private injector: Injector, public planCadastralService: SdAffectationService)
  { super();}

  ngOnInit(): void {


    this.monTableau=new SycadTableMetaData("Tableau des dossiers des affectations",true,false);
    this.monTableau
    .pushColumn(new SycadTableColonne("numero","Dossier",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("parcelle.icad","Parcelle",true,TypeColonne.STRING,true,""))

    .pushColumn(new SycadTableColonne("etatDossier","Etat Processus",true,TypeColonne.BOOLEAN,true,""))
    .pushColumn(new SycadTableColonne("objet","Objet",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("transmission.transmission","Structure traitant",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("dateMajPlan","Date Mise à jour",false,TypeColonne.DATE,true,""))
    .pushColumn(new SycadTableColonne("etat","Etat dossier",true,TypeColonne.STRING,true,""))

    .pushColumn(new SycadTableColonne("attributaire.codeUnique","IFU-Code",true,TypeColonne.STRING,true,"",true,"attributaire_nom"))
    .pushColumn(new SycadTableColonne("attributaire.pieceOfficielle.categorie.libelle","Type de pièce",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("attributaire.pieceOfficielle.numero","N° Pièce",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("attributaire.pieceOfficielle.dateObtention","Date de la pièce",true,TypeColonne.DATE,true,""))
    .pushColumn(new SycadTableColonne("attributaire.emails[0].value","Email",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("attributaire.telephones[0].value","Téléphone",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("attributaire.nom","Nom",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("attributaire.prenoms","Prenom",true,TypeColonne.STRING,true,"",true,"attributaire_prenoms"))
    .pushColumn(new SycadTableColonne("attributaire.lieuNaissance","Lieu de naissance",true,TypeColonne.STRING,true,"",false))
    .pushColumn(new SycadTableColonne("attributaire.dateNaissance","Date de naissance",true,TypeColonne.STRING,true,"",false))
    .pushColumn(new SycadTableColonne("attributaire.profession","Profession",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("attributaire.activitePrincipale","Activité principale",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("attributaire.denomination","Dénomination",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("attributaire.sigle","Sigle",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("transmissionCreateur.transmission","Structure créatrice",false,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("dateCreationDossier","Date de création",true,TypeColonne.DATETIME,true,""));

      this.monTableau.typeRessource="DossierSaisieAffectationResource";
      this.monTableau.isExport=true;

    this.monTableau.transformeToProcessus();


    this.loadComponent();
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
    tableauComponent.instance.backendApiService=this.planCadastralService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onAddData.subscribe($event =>  this.actionProcessus(new ActionProcessusEvent(null,null)));
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.onActionProcessu.subscribe($event =>  this.actionProcessus($event));
    tableauComponent.instance.onPreviewData.subscribe($event =>  this.vueAffectation($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;
  }
  public finishExport(event: StatsExport) {
    this._snackBar.open(`Export affectation terminé. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }
  public actionProcessus(context: ActionProcessusEvent) {
    if(context.numero){
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_AFFECTATION}/edition`, context.numero,context.transition.code],{
        state: {
          context
        }
      });
    }else {
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_AFFECTATION}/edition`]);

    }

  }

  public vueAffectation(affectation: AffectationParcelle){
     this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_AFFECTATION}/view`, affectation.numero]);
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
