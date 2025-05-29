import { Compiler, Component, Injector, NgModuleFactory, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SycadTableMetaData, SycadTableColonne, TypeColonne, ActionProcessusEvent, GenericActionEvent } from '@sycadApp/libs/model-table';
import { AbstractSycadTableComponent } from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import {  ExonerationDossier } from '@sycadApp/models/impot/exoneration.model';
import { ExonerationService } from '@sycadApp/services/impot/exoneration.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { StatsExport } from '@sycadApp/shared/directives/export.service';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-exoneration',
  templateUrl: './exoneration.component.html',
  styleUrls: ['./exoneration.component.scss']
})
export class ExonerationComponent extends AbstractSycadTableComponent implements OnInit {

  @ViewChild('datatable1', { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();
  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver,
              private router: Router,
              public confirmService: AppConfirmService,
              public dialog: MatDialog, private compiler: Compiler,
              private injector: Injector, public planCadastralService: ExonerationService) { super(); }

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
      tableauComponent.instance.backendApiService = this.planCadastralService;
      tableauComponent.instance.actions = this.actions;
      tableauComponent.instance.onAddData.subscribe($event =>  this.actionProcessus(new ActionProcessusEvent(null, null)));
      tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
      tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
      tableauComponent.instance.onActionProcessu.subscribe($event =>  this.actionProcessus($event));
      tableauComponent.instance.onPreviewData.subscribe($event =>  this.vueExoneration($event));
      tableauComponent.instance.refeshDataSubject = this.refeshDataSubject;
    }


  ngOnInit(): void {
    this.monTableau = new SycadTableMetaData('Tableau des dossiers d\'exonerations', true, false);
    this.monTableau.typeRessource="DossierExonerationResource";
    this.monTableau.isExport=true;
   
    this.monTableau.transformeToProcessus();
    this.monTableau
      .pushColumn(new SycadTableColonne('objet', 'Objet', true, TypeColonne.STRING, true, ''))
      .pushColumn(new SycadTableColonne('dateCreationDossier', 'Date dossier', true, TypeColonne.DATETIME, true, ''))
      .pushColumn(new SycadTableColonne('exoneration.parcelle.icad', 'Parcelle', true, TypeColonne.STRING, true, ''))
    //  .pushColumn(new SycadTableColonne('exoneration.parcelle.arrondissement.nom', 'Arrondissement', true, TypeColonne.STRING, true, ''))
     // .pushColumn(new SycadTableColonne('exoneration.parcelle.arrondissement.commune.nom', 'Commune', true, TypeColonne.STRING, true, ''))
      .pushColumn(new SycadTableColonne('numero', 'Numero', true, TypeColonne.STRING, true, ''))
     // .pushColumn(new SycadTableColonne('exoneration.categorie.motif', 'Catégorie exonération', true, TypeColonne.STRING, true, ''))
      .pushColumn(new SycadTableColonne('exoneration.natureImpot.libelle', 'Nature impôt', true, TypeColonne.STRING, true, ''))
      .pushColumn(new SycadTableColonne("exoneration.contribuable.nom","Nom",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("exoneration.contribuable.prenoms","Prenom",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("exoneration.contribuable.codeUnique","IFU-Code",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("exoneration.contribuable.lieuNaissance","Lieu de naissance",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("exoneration.contribuable.dateNaissance","Date de naissance",true,TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("exoneration.contribuable.pieceOfficielle.categorie.libelle","Type de pièce",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("exoneration.contribuable.pieceOfficielle.numero","N° Pièce",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("exoneration.contribuable.pieceOfficielle.nip","NIP",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("exoneration.contribuable.pieceOfficielle.dateObtention","Date de la pièce",true,TypeColonne.DATE,true,""))
      .pushColumn(new SycadTableColonne("exoneration.contribuable.activitePrincipale","Activité principale",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("exoneration.contribuable.denomination","Dénomination",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("exoneration.contribuable.sigle","Sigle",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("exoneration.contribuable.numCNSS","N° CNSS",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("exoneration.contribuable.nomPere","Nom du père ",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("exoneration.contribuable.prenomsPere","Prenom du père",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("exoneration.contribuable.nomMere","Nom de la mère",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("exoneration.contribuable.prenomsMere","Prenom de la mère",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("exoneration.contribuable.profession","Profession",true,TypeColonne.STRING,true,""))
      
      .pushColumn(new SycadTableColonne('exoneration.montant', 'Montant', true, TypeColonne.STRING, true, ''))
      .pushColumn(new SycadTableColonne('exoneration.taux', 'Taux', true, TypeColonne.STRING, true, ''))
      .pushColumn(new SycadTableColonne('exoneration.dateDebut', 'Date debut', true, TypeColonne.DATE, true, ''))
      .pushColumn(new SycadTableColonne('exoneration.dateFin', 'Date fin', true, TypeColonne.DATE, true, ''))
      .pushColumn(new SycadTableColonne('etat', 'Etat processus du dossier', true, TypeColonne.STRING, true, ''))
      .pushColumn(new SycadTableColonne('etatDossier', 'Etat du dossier', true, TypeColonne.BOOLEAN, true, ''))
      .pushColumn(new SycadTableColonne('refExterne', 'Référence externe', true, TypeColonne.STRING, true, ''))
      .pushColumn(new SycadTableColonne('dateExterne', 'Date externe', false, TypeColonne.DATE, true, ''))
     // .pushColumn(new SycadTableColonne('dateMajPlan', 'Date Mise à jour', false, TypeColonne.DATE, true, ''))
    this.loadComponent();



  }
  public finishExport(event: StatsExport) {
    this._snackBar.open(`Export exoneration terminé. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }
  public actionProcessus(context: ActionProcessusEvent) {
    if (context.numero){
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_EXONERATION}/edition`, context.numero, context.transition.code], {
        state: {
          context
        }
      });
    }else {
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_EXONERATION}/edition`]);

    }

  }

  public vueExoneration(exoneration: ExonerationDossier){
     this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_EXONERATION}/view`, exoneration.numero]);
   }

  public genericAction(context: GenericActionEvent) {
   // console.log('une action quelconque  ', context);
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: 'top'

    });
  }
}
