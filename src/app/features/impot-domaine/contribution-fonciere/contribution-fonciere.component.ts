import { NgModuleFactory, ViewEncapsulation } from '@angular/core';
import { Compiler, Component, Injector, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';
import { SycadTableMetaData, SycadTableColonne, TypeColonne, GenericAction, ActionProcessusEvent, GenericActionEvent } from '@sycadApp/libs/model-table';
import { AbstractSycadTableComponent } from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import { DossierContributionFonciere } from '@sycadApp/models/impot/contribution-fonciere.model';
import { PlanCadastralFusionementElement } from '@sycadApp/models/workflow/cp-fusionnement.model';
import { BornageDelimitationService } from '@sycadApp/services/bornage/bornage-delimitation.service';
import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';
import { ContributionFonciereService } from '@sycadApp/services/impot/contribution-fonciere.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { StatsExport } from '@sycadApp/shared/directives/export.service';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';
import { FormGenerationContributionFonciereComponent } from './form-generation-cf/form-generation-cf.component';

@Component({
  selector: 'app-contribution-fonciere',
  templateUrl: './contribution-fonciere.component.html',
  styleUrls: ['./contribution-fonciere.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContributionFonciereComponent extends AbstractSycadTableComponent implements OnInit {
  @ViewChild('datatable1', { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public authentificatedUser: AuthentificatedUser;

  public refeshDataSubject: Subject<string> = new Subject<string>();
  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(private _snackBar: MatSnackBar,
    private mediaObserver: MediaObserver,
    public authService: AuthenticationService,
    private router: Router,
    public confirmService: AppConfirmService,
    public dialog: MatDialog, private compiler: Compiler,
    private injector: Injector,public contributionFonciereService: ContributionFonciereService) {
    super();
  }

  ngOnInit(): void {


    this.monTableau=new SycadTableMetaData("Liste des contributions foncières",true,false);
    this.monTableau
    .pushColumn(new SycadTableColonne("numero","Numéro",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("etat","Processus",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("objet","Objet",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuable.codeUnique","IFU-Code",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("parcelle.icad","Icad",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("avisImposition","Avis imposition",true,TypeColonne.LIEN,true,""))
    .pushColumn(new SycadTableColonne("calendrierFiscale.libelle","Calendrier",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("transmission.transmission","Localisation dossier",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("dateCreationDossier","Date de création",true,TypeColonne.DATETIME,true,""))
    .pushColumn(new SycadTableColonne("dateModificationDossier","Date de modification",true,TypeColonne.DATETIME,true,""))
    .pushColumn(new SycadTableColonne("etatDossier","Actif ?",true,TypeColonne.BOOLEAN,true,""))
    .pushColumn(new SycadTableColonne("valeurDeclare","Valeur Declarée",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuable.nom","Nom",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuable.prenoms","Prenom",true,TypeColonne.STRING,true,""))

    .pushColumn(new SycadTableColonne("contribuable.lieuNaissance","Lieu de naissance",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuable.dateNaissance","Date de naissance",true,TypeColonne.DATE,true,""))
    .pushColumn(new SycadTableColonne("contribuable.activitePrincipale","Activité principale",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuable.denomination","Dénomination",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuable.sigle","Sigle",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuable.numCNSS","N° CNSS",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuable.nomPere","Nom du père ",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuable.prenomsPere","Prenom du père",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuable.nomMere","Nom de la mère",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuable.prenomsMere","Prenom de la mère",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuable.profession","Profession",true,TypeColonne.STRING,false,""))
    .pushColumn(new SycadTableColonne("contribuable.pieceOfficielle.categorie.libelle","Type de pièce",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuable.pieceOfficielle.numero","N° Pièce",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuable.pieceOfficielle.nip","NIP",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("contribuable.pieceOfficielle.dateObtention","Date de la pièce",true,TypeColonne.DATE,true,""))




    .pushColumn(new SycadTableColonne("transmissionCreateur.transmission","Localisation créateur dossier",false,TypeColonne.STRING,true,""));


    this.monTableau.typeRessource="DossierContributionFonciereResource";
    this.monTableau.isExport=true;

    this.monTableau.transformeToProcessus();


    this.loadComponent();
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
    tableauComponent.instance.tableDescription = this.monTableau;
    tableauComponent.instance.backendApiService = this.contributionFonciereService;
    tableauComponent.instance.actions = this.actions;
    tableauComponent.instance.onAddData.subscribe($event =>  this.actionProcessus(new ActionProcessusEvent(null, null)));
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.onActionProcessu.subscribe($event =>  this.actionProcessus($event));
    tableauComponent.instance.onPreviewData.subscribe($event =>  this.vueFusion($event));
    tableauComponent.instance.refeshDataSubject = this.refeshDataSubject;
  }

  public isLoadingResults:Boolean = false;
  public dialogRef: MatDialogRef<FormGenerationContributionFonciereComponent,any>;

  public openFormModal(){
    let { width,height,position}=this.getCorrectWidth();

    this.dialogRef = this.dialog.open(FormGenerationContributionFonciereComponent, {
      data: {},
      panelClass:"sycad-dialog-form",
      width: width,
      height: height,
      position: position,
      disableClose:true
    });

    this.dialogRef.afterClosed().subscribe(statGenerationContributionFonciere => {
      if(statGenerationContributionFonciere) {
        this.refeshDataSubject.next("");
        this._snackBar.open
        (`Nombre total de dossier générés : ${statGenerationContributionFonciere.nombreTotal} `, 'Ok', {
          duration: 120000,
          horizontalPosition:"center",
          verticalPosition: "top"
        });
      }

    });

  }


  public finishExport(event: StatsExport) {
    this._snackBar.open
    (`Export contribution foncière terminé. Fichier : ${event.fileName},
    Taille: ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }
  public actionProcessus(context: ActionProcessusEvent) {
    if (context.numero) {
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_CONTRIBUTION_FONCIERE}/edition`,
        context.numero, context.transition.code],
        {state: {
          context
        }
      });
    } else {
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_CONTRIBUTION_FONCIERE}/edition`]);
    }


  }
  public vueFusion(contributionFonciere: DossierContributionFonciere){
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_CONTRIBUTION_FONCIERE}/view`, contributionFonciere.numero]);
  }

  public genericAction(context: GenericActionEvent) {
   // console.log('une action quelconque ', context)
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: 'top'

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
