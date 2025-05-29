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
import {MediaObserver} from '@angular/flex-layout';
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
import { environment } from 'environments/environment';
import { SdDelivranceAapService } from '@sycadApp/services/workflow/sd-delivrance-aap.service';
import { DelivranceAap } from '@sycadApp/models/workflow/sd-delivrance-aap.model';


@Component({
  selector: 'app-saisie-differee-delivrance-aap',
  templateUrl: './sd-delivrance-aap.component.html',
  styleUrls: ['./sd-delivrance-aap.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SdDelivranceAap extends AbstractSycadTableComponent  implements OnInit {


  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();
  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor( private _snackBar: MatSnackBar,
               private mediaObserver: MediaObserver,
               private router: Router,
               public confirmService: AppConfirmService,
               public dialog: MatDialog,private compiler: Compiler,
               private injector: Injector, public delivranceService: SdDelivranceAapService)
  { super(); }

  ngOnInit(): void {


    this.monTableau=new SycadTableMetaData("Tableau des attestations d'attribution de parcelles",true,false);
    this.monTableau
    .pushColumn(new SycadTableColonne("numero","Dossier",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("parcelle.icad","Parcelle",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("documentDeSortie.numero","Numéro du titre",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("documentDeSortie.dateDoc","Date du titre",true,TypeColonne.DATE,true,""))
    .pushColumn(new SycadTableColonne("documentDeSortie.pieceJointe[0]","Document du titre",true,TypeColonne.LIEN,true,""))
    .pushColumn(new SycadTableColonne("statusDossier","Statut Processus",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("etat","Etat Dossier",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("objet","Objet",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("transmission.transmission","Structure traitante",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("dateMajPlan","Date Mise à jour",false,TypeColonne.DATE,true,""))

    .pushColumn(new SycadTableColonne("contribuableBeneficiaire.codeUnique","IFU-Code",true,TypeColonne.STRING,true,"",true,"attributaire_nom"))
    .pushColumn(new SycadTableColonne("contribuableBeneficiaire.pieceOfficielle.categorie.libelle","Type de pièce",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuableBeneficiaire.pieceOfficielle.numero","N° Pièce",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuableBeneficiaire.pieceOfficielle.dateObtention","Date de la pièce",true,TypeColonne.DATE,true,""))
    .pushColumn(new SycadTableColonne("contribuableBeneficiaire.emails[0]?.value","Email",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuableBeneficiaire.telephones[0]?.value","Téléphone",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuableBeneficiaire.nom","Nom",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuableBeneficiaire.prenoms","Prenom",true,TypeColonne.STRING,true,"",true,"contribuableBeneficiaire_prenoms"))
    .pushColumn(new SycadTableColonne("contribuableBeneficiaire.lieuNaissance","Lieu de naissance",true,TypeColonne.STRING,true,"",false))
    .pushColumn(new SycadTableColonne("contribuableBeneficiaire.dateNaissance","Date de naissance",true,TypeColonne.STRING,true,"",false))
    .pushColumn(new SycadTableColonne("contribuableBeneficiaire.profession","Profession",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuableBeneficiaire.activitePrincipale","Activité principale",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuableBeneficiaire.denomination","Dénomination",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuableBeneficiaire.sigle","Sigle",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("transmissionCreateur.transmission","Structure créatrice",false,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("dateCreationDossier","Date de création",true,TypeColonne.DATETIME,true,""));

      this.monTableau.typeRessource="DossierSaisieDelivranceAAP";
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
    tableauComponent.instance.backendApiService=this.delivranceService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onAddData.subscribe($event =>  this.actionProcessus(new ActionProcessusEvent(null,null)));
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.onActionProcessu.subscribe($event =>  this.actionProcessus($event));
    tableauComponent.instance.onPreviewData.subscribe($event =>  this.vueAttribution($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;
  }
  public finishExport(event: StatsExport) {
    this._snackBar.open(`Exportation de l'attestation terminée. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }
  public actionProcessus(context: ActionProcessusEvent) {
    if(context.numero){
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DELIVRANCE_AAP}/edition`, context.numero,context.transition.code],{
        state: {
          context
        }
      });
    } else {
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DELIVRANCE_AAP}/edition`]);
    }
  }

  public vueAttribution(dossier: DelivranceAap){
     this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DELIVRANCE_AAP}/view`, dossier.numero]);
   }

  public terminerDelivrance(dossier: DelivranceAap){
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DELIVRANCE_AAP}/close`, dossier.numero]);
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
