import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Exoneration } from '@sycadApp/models/evaluation/exoneration.model';
import { DossierContributionFonciere } from '@sycadApp/models/impot/contribution-fonciere.model';
import { Impot, ReglementTitreRecette, TitreRecette, ValeurElementLiquidation } from '@sycadApp/models/impot/mode-reglement.model';
import { Transition } from '@sycadApp/models/workflow/common/general';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-vue-contribution-fonciere',
  templateUrl: './vue-contribution-fonciere.component.html',
  styleUrls: ['./vue-contribution-fonciere.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class VueContributionFonciereComponent implements OnInit {

  @Input()
  public noOpenActions: boolean=false;


  public contribuableFoncier:DossierContributionFonciere;
  public transition: Transition;
  public displayedColumnsTitreRecette: string[] = ['numeroTitre','codeTitre', 'numeroTitreRecetteParent', 'dateTitre','typeTitreRecette','exerciceFiscale',  'anneeExFiscale','montantGlobal','montantExoneration', 'montant', 'montantReglement',  'montantRestant', 'estSolder','natureTitreRecette', 'etatTitre',   'dateDebutExFiscale', 'dateFinExFiscale', 'etatExFiscale'];
  public dataSourceTitreRecette = new MatTableDataSource();
  public displayedColumnsPiece: string[] = ['categorie', 'reference', 'autorite', 'dateDelivrance', 'dateExpiration', 'imageUrl'];
  public dataSourcePiece = new MatTableDataSource();
  public displayedColumnsMandat: string[] = ['actif', 'objet', 'description','reference',"debut","fin",'mandataire','pieceJointe'];
  public dataSourceMandat = new MatTableDataSource();
  public displayedColumnsDocument: string[] = ['code', 'libelle', 'dateEdition','dateValidite','typeDocument','action'];
  public dataSourceDocument = new MatTableDataSource();
  public displayedColumnsImpot: string[] = ['natureImpot','typeNatureImpot','rumap','codeSI', 'montant', 'montantExoneration','montantNet', 'typeDroit', 'libelleCourt'];
  public dataSourceImpot:MatTableDataSource<Impot>;
  public displayedColumnsReglement: string[] = ['numeroQuittance','dateReglement', 'montant', 'modeReglement'];
  public dataSourceReglement=new MatTableDataSource();
  public displayedColumnsExoneration: string[] = ['refExterne', 'motif','taux', 'montant', 'dateDebut', 'dateFin', 'contribuable', 'etatMev', 'refLoi', 'categorie', 'parcelle', 'natureImpot', 'typeNatureImpot', 'code', 'codeSI', 'ordre', 'libelleCourt',  'pieceOfficielle', 'infoAdress', 'infoPhone', 'email', 'modifDoc'];
  public dataSourceExoneration: MatTableDataSource<Exoneration>;
  public displayedColumnsElemetLiquidation: string[] = ['codeElmentLiq', 'libelleElmentLiq', 'baseImpot', 'titrebaseImpot', 'expressionbaseImpot', 'titreTaux', 'expressionTaux', 'taux', 'signeElmentLiq', 'uniteElmentLiq', 'montant'];
  titreRecetteData: any[] = [];
  impotData: any[] = [];

  @ViewChild('outerSort', { static: true }) sort: MatSort;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<ReglementTitreRecette>>;
  @ViewChildren('innerTables1') innerTables1: QueryList<MatTable<any>>;

  expandedElement: TitreRecette | null;
  expandedElement1: Impot | null;

  constructor( private cd: ChangeDetectorRef, public route: ActivatedRoute, public router: Router,public _adapter: DateAdapter<any>) {

    this.contribuableFoncier = this.route.snapshot.data["contributionFonciere"];
    this.transition = this.route.snapshot.data["transition"];
  }

  get urlAction(){
    return `${environment.FRONTEND_ROUTES.PROCESSUS_CONTRIBUTION_FONCIERE}/edition`;
  }

  ngOnInit(): void {
   // console.log( this.contribuableFoncier);
   this._adapter.setLocale("fr");
   this.dataSourceTitreRecette.data=this.contribuableFoncier?.titresRecette;
   this.dataSourcePiece.data=this.contribuableFoncier?.listPieces;
   this.dataSourceMandat.data=this.contribuableFoncier?.mandats;
   this.dataSourceDocument.data=this.contribuableFoncier?.documents;


  /*  if(this.contribuableFoncier.titresRecette) {

    let arrayOrArrayImpot = this.contribuableFoncier.titresRecette.map(titre =>titre.impots.map(impot=>impot));
    let impots1 =  arrayOrArrayImpot.reduce((acc, val) => acc.concat(val), []);
    let impots2 =  impots1.reduce((acc, val) => acc.concat(val), []);
    this.dataSourceImpot= new MatTableDataSource(impots2);


    } */

    if(this.contribuableFoncier.titresRecette) {

      this.contribuableFoncier.titresRecette.forEach(titre => {
        if (titre.reglements && Array.isArray(titre.reglements) && titre.reglements.length) {
          this.titreRecetteData = [...this.titreRecetteData, {...titre, reglements: new MatTableDataSource(titre.reglements)}];
        } else {
          this.titreRecetteData = [...this.titreRecetteData, titre];
        }
      });

      this.dataSourceTitreRecette= new MatTableDataSource(this.titreRecetteData);

      this.contribuableFoncier.titresRecette.forEach(titre => {
        titre.impots.forEach(impot => {
          if (Array.isArray(titre.impots) && titre.impots.length) {
            this.impotData = [...this.impotData, { ...impot, valeurElementLiquidations: new MatTableDataSource(impot.valeurElementLiquidations) }];
          }
          else {
            this.impotData = [...this.impotData, impot];

          }
        })
      });
      this.dataSourceImpot = new MatTableDataSource(this.impotData);

      let arrayOrArrayExonertaion =  this.contribuableFoncier.titresRecette.map(titre =>titre.impots.map(impot=>impot.exonerations));
      let exonerations1 =  arrayOrArrayExonertaion.reduce((acc, val) => acc.concat(val), []);
      let exonerations2 =  exonerations1.reduce((acc, val) => acc.concat(val), []);
      this.dataSourceExoneration= new MatTableDataSource(exonerations2);
      }

  }

  toggleRowReglement(element: TitreRecette) {

    element.reglements && (element.reglements as MatTableDataSource<ReglementTitreRecette>).data?.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<ReglementTitreRecette>).sort = this.innerSort.toArray()[index]);
  }
  applyFilterTitre(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceTitreRecette.filter = filterValue.trim().toLowerCase();
  }
  clearFilterTitre() {
    this.dataSourceTitreRecette.filter ="";
  }
  applyFilterReglement(filterValue: string) {
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<ReglementTitreRecette>).filter = filterValue.trim().toLowerCase());
  }
  clearFilterReglement(){
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<ReglementTitreRecette>).filter = "");
  }

  toggleRowValEltLiquid(element: Impot) {
    element.valeurElementLiquidations && (element.valeurElementLiquidations as any).data?.length ? (this.expandedElement1 = this.expandedElement1 === element ? null : element) : null;
    this.cd.detectChanges();
    this.innerTables1.forEach((table, index) => (table.dataSource as MatTableDataSource<ValeurElementLiquidation>).sort = this.innerSort.toArray()[index]);
  }
  applyFilterValeurElmntLiquid(filterValue: string) {
    this.innerTables1.forEach((table, index) => {
      (table.dataSource as MatTableDataSource<ValeurElementLiquidation>).filter = filterValue.trim().toLowerCase();
    });
  }
  clearFilterValeurElmntLiquid() {
    this.innerTables1.forEach((table, index) => (table.dataSource as MatTableDataSource<ValeurElementLiquidation>).filter = "");
  }

}
