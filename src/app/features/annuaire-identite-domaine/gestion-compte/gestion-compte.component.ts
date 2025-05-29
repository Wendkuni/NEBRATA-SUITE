import { Compiler, Component, Injector, NgModuleFactory, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettingsService } from '@sycadApp/config/app.settings.service';
import { ActionProcessusEvent, GenericActionEvent, SycadTableColonne, SycadTableMetaData, TypeColonne } from '@sycadApp/libs/model-table';
import { AbstractSycadTableComponent } from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import { CompteElement } from '@sycadApp/models/data-references/contribuables/compte.model';
import { CompteService } from '@sycadApp/services/data-references/contribuables/compte.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { StatsExport } from '@sycadApp/shared/directives/export.service';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-gestion-compte',
  templateUrl: './gestion-compte.component.html',
  styleUrls: ['./gestion-compte.component.scss']
})
export class GestionCompteComponent extends AbstractSycadTableComponent  implements OnInit {

 typeCompte:string;

  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;
  public refeshDataSubject: Subject<string> = new Subject<string>();

  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(private mediaObserver: MediaObserver, private _snackBar: MatSnackBar,
    public dialog: MatDialog, private compiler: Compiler,
    private injector: Injector,public appSettings: AppSettingsService,
    private router: Router, public compteService: CompteService,
    private route: ActivatedRoute,public confirmService: AppConfirmService) {super(); }

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
    tableauComponent.instance.backendApiService=this.compteService;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onAddData.subscribe($event =>  this.actionProcessus(new ActionProcessusEvent(null, null)));
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.onActionProcessu.subscribe($event =>  this.actionProcessus($event));
    tableauComponent.instance.onPreviewData.subscribe($event =>  this.visualiser($event));
    tableauComponent.instance.refeshDataSubject = this.refeshDataSubject;

  }

  ngOnInit(): void {
    this.monTableau=new SycadTableMetaData("Tableau des demandes de compte",true,false, false, "", false);
    this.monTableau.typeRessource="CompteResource";
    this.monTableau.isExport=true,

    this.monTableau.transformeToProcessus();
    this.monTableau
    .pushColumn(new SycadTableColonne("numero","Numéro",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("dateCreationDossier","Date dossier",true,TypeColonne.DATETIME,true,""))
    .pushColumn(new SycadTableColonne("typeCompte","Type compte",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("etat","Etat du dossier",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("transmission.transmission","Localisation dossier",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.numeroIfu","IFU",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.email","Email",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.telephone","Téléphone",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.pieceOfficielle.categorie.libelle","Pièce officielle",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.pieceOfficielle.numero","N° Pièce",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.pieceOfficielle.nip","NIP",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.pieceOfficielle.autoriteDeDelivrance","Autorité de délivrance Pièce",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.pieceOfficielle.lieuDeDelivrance","Lieu de délivrance Pièce",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.pieceOfficielle.dateObtention","Date obtention pièce",true,TypeColonne.DATE,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.pieceOfficielle.dateExpiration","Date expiration pièce",true,TypeColonne.DATE,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.pieceOfficielle.documentPiece","Pièce PJ",true,TypeColonne.LIEN,true,""))

    .pushColumn(new SycadTableColonne("informationsContribuable.infoParcelle.commune.nom","Commune parcelle",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.infoParcelle.section.numero","Numéro section parcelle",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.infoParcelle.ilot.numero","Numéro ilot parcelle",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.infoParcelle.numero","Numéro parcelle",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.infoParcelle.numeroAncien","Numéro ancien parcelle",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.infoParcelle.documentParcelle.documentType.libelle","type document parcelle",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.infoParcelle.documentParcelle.dateDoc","Date document parcelle",true,TypeColonne.DATE,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.infoParcelle.documentParcelle.dateValidite","Date validité document parcelle",true,TypeColonne.DATE,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.infoParcelle.documentParcelle.numero","Numéro document parcelle",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.infoParcelle.documentParcelle.pieceJointe","Document titre parcelle",true,TypeColonne.LIEN,true,""))




    .pushColumn(new SycadTableColonne("informationsContribuable.nom","Nom",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.nomDeJeuneFille","Nom de jeune fille",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.prenoms","Prenom",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.genre","Genre",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.matricule","Matricule",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.dateNaissance","Date de naissance",true,TypeColonne.DATE,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.lieuNaissance","Lieu de naissance",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.fonction","Fonction",false,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.nomPere","Nom du père ",false,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.prenomsPere","Prenom du père",false,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.nomMere","Nom de la mère",false,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.prenomsMere","Prenom de la mère",false,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.civilite.libelle","Civilité",false,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.nationalite.libelle","Nationalité",false,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.profession.nom","Profession",false,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.situationMatrimoniale.libelle","Situation Matrimoniale",false,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.affectation.structure.nom","Structure affectation",false,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.affectation.service.nom","Service affectation",false,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.affectation.bureau.nom","Bureau affectation",false,TypeColonne.STRING,true,""))


    .pushColumn(new SycadTableColonne("informationsContribuable.denomination","Dénomination",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.sigle","Sigle",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("informationsContribuable.dateCreation","Date de création",true,TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("informationsContribuable.numCNSS","Numéro CNSS",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("informationsContribuable.categorie.libelle","Catégorie acteur",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("informationsContribuable.activitePrincipale.nom","Activité principale",true,TypeColonne.STRING,true,""))

      .pushColumn(new SycadTableColonne("informationsContribuable.statusJuridique.libelle","Statut juridique",false,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("informationsContribuable.regimeFiscal.libelle","Régime fiscal",false,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("informationsContribuable.capitalFiscal","Capital fiscal",false,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("informationsContribuable.chiffreAffaire","Chiffre d'affaire",false,TypeColonne.STRING,true,""));



    /*

    */

    this.loadComponent();
    }

    public genericAction(context: GenericActionEvent) {
    }

    public finishExport(event: StatsExport) {
      this._snackBar.open
      (`Export Plan cadastral lotissement  terminé. Fichier : ${event.fileName},
      Taille: ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
        duration: 4000
      });

    }
    public actionProcessus(context: ActionProcessusEvent) {
      if (context.numero) {
        this.router.navigate([`${environment.FRONTEND_ROUTES.GESTION_COMPTE}/edition`,
          context.numero, context.transition.code],
          {state: {
            context
          }
        });
      } else {
        this.router.navigate([`${environment.FRONTEND_ROUTES.GESTION_COMPTE}/edition`]);
      }


    }

    public visualiser(compteDossier: CompteElement){
      this.router.navigate([`${environment.FRONTEND_ROUTES.GESTION_COMPTE}/view`, compteDossier.numero]);
    }
}
