import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DossierBornage } from '@sycadApp/models/bornage/bornage.model';
import { Exoneration } from '@sycadApp/models/evaluation/exoneration.model';
import { Impot, ReglementTitreRecette, TitreRecette, ValeurElementLiquidation } from '@sycadApp/models/impot/mode-reglement.model';
import { Transition } from '@sycadApp/models/workflow/common/general';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-vue-bornage-delimitation',
  templateUrl: './vue-bornage-delimitation.component.html',
  styleUrls: ['./vue-bornage-delimitation.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ], 
})
export class VueBornageDelimitationComponent implements OnInit {


  @Input() 
  public noOpenActions: boolean=false;

  public bornage: DossierBornage;
  public transition: Transition;
  public dataSourcePiece = new MatTableDataSource();
  public displayedColumnsPiece: string[] = ['categorie', 'reference', 'autorite', 'dateDelivrance', 'dateExpiration', 'imageUrl'];
  public dataSourceDocument = new MatTableDataSource();
  public displayedColumnsDocument: string[] = ['code', 'libelle', 'dateEdition', 'dateValidite', 'typeDocument', 'action'];
  public dataSourceMandat = new MatTableDataSource();
  public displayedColumnsMandat: string[] = ['objet', 'debut', 'fin', 'reference', 'description', 'mandant', 'mandataire', 'action'];
  public dataSourceTemoin = new MatTableDataSource();
  public displayedColumnsTemoin: string[] = ['nom', 'prenom', 'email', 'genre', 'telephone', 'profession', 'action'];
  public dataSourceImmeuble = new MatTableDataSource();
  public displayedColumnsImmeuble: string[] = ['type', 'categorie', 'numero', 'libelle', 'dimension', 'dateRealisation'];
  public dataSourceDelimParcelle = new MatTableDataSource();
  public displayedColumnsDelimParcelle: string[] = ['point', 'gpsX', 'gpsY', 'distance', 'gissement', 'sens', 'limitation'];
  public dataSourceTitreRecette = new MatTableDataSource();
  public displayedColumnsTitreRecette: string[] = ['numeroTitre', 'codeTitre','numeroTitreRecetteParent', 'dateTitre','typeTitreRecette','exerciceFiscale',  'anneeExFiscale','montantGlobal','montantExoneration', 'montant', 'montantReglement',  'montantRestant', 'estSolder','natureTitreRecette', 'etatTitre',   'dateDebutExFiscale', 'dateFinExFiscale', 'etatExFiscale'];
  public dataSourceImpot: MatTableDataSource<Impot>;
  public displayedColumnsImpot: string[] = ['natureImpot', 'typeNatureImpot', 'codeSI', 'montant', 'montantExoneration','montantNet', 'typeDroit', 'libelleCourt'];
  public dataSourceExoneration: MatTableDataSource<Exoneration>;
  public displayedColumnsExoneration: string[] = ['refExterne', 'motif','taux', 'montant', 'dateDebut', 'dateFin', 'contribuable', 'etatMev', 'refLoi', 'categorie', 'parcelle', 'natureImpot', 'typeNatureImpot', 'code', 'codeSI', 'ordre', 'libelleCourt',  'pieceOfficielle', 'infoAdress', 'infoPhone', 'email', 'modifDoc'];
  public dataSourceElemetLiquidation: MatTableDataSource<ValeurElementLiquidation>;
  public displayedColumnsElemetLiquidation: string[] = ['codeElmentLiq', 'libelleElmentLiq', 'baseImpot', 'titrebaseImpot', 'expressionbaseImpot', 'titreTaux', 'expressionTaux', 'taux', 'signeElmentLiq', 'uniteElmentLiq', 'montant'];
  public dataSourceReglement = new MatTableDataSource();
  public displayedColumnsReglement: string[] = ['numeroQuittance', 'dateReglement', 'montant', 'modeReglement'];

  titreRecetteData: any[] = [];
  impotData: any[] = [];

  @ViewChild('outerSort', { static: true }) sort: MatSort;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<ReglementTitreRecette>>;
  @ViewChildren('innerTables1') innerTables1: QueryList<MatTable<any>>;

  expandedElement: TitreRecette | null;
  expandedElement1: Impot | null;
  constructor(private cd: ChangeDetectorRef, public route: ActivatedRoute, public router: Router, public _adapter: DateAdapter<any>) {
    this.bornage = this.route.snapshot.data["bornage"];

    this.transition = this.route.snapshot.data["transition"];
  }

  get urlAction(){
    return `${environment.FRONTEND_ROUTES.PROCESSUS_BORNAGE_DELIMITATION}/edition`;
  }
  ngOnInit(): void {
    this._adapter.setLocale("fr");
    this.dataSourcePiece.data = this.bornage.listPieces;
    this.dataSourceDocument.data = this.bornage.documents;
    this.dataSourceMandat.data = this.bornage.mandats;
    this.dataSourceDelimParcelle.data = this.bornage.delimitations;
    this.dataSourceImmeuble.data = this.bornage.immeubles;
    this.dataSourceTemoin.data = this.bornage.temoins;


    if (this.bornage.titresRecette) {

      this.bornage.titresRecette.forEach(titre => {
        if (titre.reglements && Array.isArray(titre.reglements) && titre.reglements.length) {
          this.titreRecetteData = [...this.titreRecetteData, { ...titre, reglements: new MatTableDataSource(titre.reglements) }];
        } else {
          this.titreRecetteData = [...this.titreRecetteData, titre];
        }
      });
      this.dataSourceTitreRecette = new MatTableDataSource(this.titreRecetteData);
  
      this.bornage.titresRecette.forEach(titre => {
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

      let arrayOrArrayExonertaion = this.bornage.titresRecette.map(titre => titre.impots.map(impot => impot.exonerations));
      let exonerations1 = arrayOrArrayExonertaion.reduce((acc, val) => acc.concat(val), []);
      let exonerations2 = exonerations1.reduce((acc, val) => acc.concat(val), []);
      this.dataSourceExoneration = new MatTableDataSource(exonerations2);

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
    this.dataSourceTitreRecette.filter = "";
  }
  applyFilterReglement(filterValue: string) {
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<ReglementTitreRecette>).filter = filterValue.trim().toLowerCase());
  }
  clearFilterReglement() {
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
