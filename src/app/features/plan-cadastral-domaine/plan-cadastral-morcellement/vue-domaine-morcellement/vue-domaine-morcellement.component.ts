import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren, Input } from '@angular/core';
import {Transition} from '@sycadApp/models/workflow/common/general';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {DateAdapter} from '@angular/material/core';
import {PlanCadastralMorcellementElement} from '@sycadApp/models/workflow/cp-morcellement.model';
import { Exoneration } from '@sycadApp/models/evaluation/exoneration.model';
import { MatSort } from '@angular/material/sort';
import { Impot, ReglementTitreRecette, TitreRecette, ValeurElementLiquidation } from '@sycadApp/models/impot/mode-reglement.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-vue-domaine-morcellement',
  templateUrl: './vue-domaine-morcellement.component.html',
  styleUrls: ['./vue-domaine-morcellement.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class VueDomaineMorcellementComponent implements OnInit {
  public morcellement: PlanCadastralMorcellementElement;
  public transition: Transition;

  @Input()
  public noOpenActions: boolean=false;
  get urlAction(){
    return `${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MORCELLEMENT}/edition`;
  }
 
  public dataSourcePiece = new MatTableDataSource();
  public displayedColumnsPiece: string[] = ['categorie', 'reference', 'autorite', 'dateDelivrance', 'dateExpiration', 'imageUrl'];
  public dataSourceDocument = new MatTableDataSource();
  public displayedColumnsDocument: string[] = ['code', 'libelle', 'dateEdition','dateValidite','typeDocument','action'];
  public dataSourceMandat = new MatTableDataSource();
  public displayedColumnsMandat: string[] = ['objet', 'debut', 'fin','reference', 'description', 'mandant','mandataire','action'];
  public dataSourceParcelles = new MatTableDataSource();
  public displayedColumnsParcelle: string[] = ['icad','numero', 'libelle', 'etatMev','destination','superficie','etatAttribution','numeroIlot','arrondissement','commune','localite'];
  public dataSourceDelimParcelle= new MatTableDataSource();
  public displayedColumnsDelimParcelle: string[] = ['point','gpsX', 'gpsY','distance', 'gissement','sens','limitation'];
  public dataSourceTitreRecette = new MatTableDataSource();
  public displayedColumnsTitreRecette: string[] = ['numeroTitre', 'numeroTitreRecetteParent', 'dateTitre','typeTitreRecette','exerciceFiscale',  'anneeExFiscale', 'montantGlobal','montantExoneration', 'montant','montantReglement',  'montantRestant', 'estSolder','natureTitreRecette', 'etatTitre',   'dateDebutExFiscale', 'dateFinExFiscale', 'etatExFiscale'];
  public dataSourceImpot:MatTableDataSource<Impot>;
  public displayedColumnsImpot: string[] = ['natureImpot','typeNatureImpot','codeSI', 'montant', 'montantExoneration','montantNet', 'typeDroit', 'libelleCourt'];
  public dataSourceReglement=new MatTableDataSource();
  public displayedColumnsReglement: string[] = ['numeroQuittance','dateReglement', 'montant', 'modeReglement'];
  public dataSourceExoneration: MatTableDataSource<Exoneration>;
  public displayedColumnsExoneration: string[] = ['refExterne','motif','dateDebut','dateFin','contribuable','etatMev', 'refLoi','categorie','parcelle','natureImpot','typeNatureImpot','code','codeSI','ordre','libelleCourt','taux','montant','pieceOfficielle','infoAdress','infoPhone','email','modifDoc'];
  public dataSourceElemetLiquidation: MatTableDataSource<ValeurElementLiquidation>;
  public displayedColumnsElemetLiquidation: string[] =['codeElmentLiq','libelleElmentLiq','baseImpot','titrebaseImpot','expressionbaseImpot','titreTaux','expressionTaux','taux','signeElmentLiq','uniteElmentLiq','montant']; 
 
  titreRecetteData: any[] = [];
  impotData: any[] = [];

  @ViewChild('outerSort', { static: true }) sort: MatSort;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<ReglementTitreRecette>>;

  @ViewChildren('innerTables1') innerTables1: QueryList<MatTable<any>>;
  
  expandedElement: TitreRecette | null;
  expandedElement1: Impot | null;
  
  constructor(private cd: ChangeDetectorRef, public route: ActivatedRoute, public router: Router,public _adapter: DateAdapter<any>)
  {
    this.morcellement = this.route.snapshot.data["morcellement"];

    this.transition = this.route.snapshot.data["transition"];
  }

  ngOnInit(): void {
   // console.log(this.morcellement);
    this._adapter.setLocale("fr");
    this.dataSourcePiece.data = this.morcellement.listPieces;
    this.dataSourceDocument.data = this.morcellement.documents;
    this.dataSourceMandat.data= this.morcellement.mandats;
    this.dataSourceDelimParcelle.data=this.morcellement.delimitations;
    this.dataSourceParcelles.data=this.morcellement.parcelles;
    /*this.dataSourceImmeuble.data=this.morcellement.immeubles;
    this.dataSourceTemoin.data=  this.morcellement.temoins;*/
   
  
      if( this.morcellement.titresRecette) {
        
        this.morcellement.titresRecette.forEach(titre => {
          if (titre.reglements && Array.isArray(titre.reglements) && titre.reglements.length) {
            this.titreRecetteData = [...this.titreRecetteData, {...titre, reglements: new MatTableDataSource(titre.reglements)}];
          } else {
            this.titreRecetteData = [...this.titreRecetteData, titre];
          }
        });  
        this.dataSourceTitreRecette= new MatTableDataSource(this.titreRecetteData);

        this.morcellement.titresRecette.forEach(titre => {
          titre.impots.forEach(impot=>{
            if (Array.isArray(titre.impots) && titre.impots.length) {
              this.impotData = [...this.impotData, {...impot,valeurElementLiquidations: new MatTableDataSource(impot.valeurElementLiquidations)}];
            }
            else {
              this.impotData = [...this.impotData,impot];
             
            }
          })
        }); 
        this.dataSourceImpot= new MatTableDataSource(this.impotData);

        let arrayOrArrayExonertaion =  this.morcellement.titresRecette.map(titre =>titre.impots.map(impot=>impot.exonerations));
        let exonerations1 =  arrayOrArrayExonertaion.reduce((acc, val) => acc.concat(val), []);
        let exonerations2 =  exonerations1.reduce((acc, val) => acc.concat(val), []);
        this.dataSourceExoneration= new MatTableDataSource(exonerations2); 

        }   
      
        

        
    
  }

  toggleRowRegelement(element: TitreRecette) {

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

  toggleRowValEltLiquid(element: Impot){
    element.valeurElementLiquidations && (element.valeurElementLiquidations as  any).data?.length ? (this.expandedElement1 = this.expandedElement1 === element ? null : element) : null;
    this.cd.detectChanges();
    this.innerTables1.forEach((table, index) => (table.dataSource as MatTableDataSource<ValeurElementLiquidation>).sort =  this.innerSort.toArray()[index]);
  }
  applyFilterValeurElmntLiquid(filterValue: string) {
    this.innerTables1.forEach((table, index) =>{  
      (table.dataSource as MatTableDataSource<ValeurElementLiquidation>).filter = filterValue.trim().toLowerCase();
      }); 
  }
  clearFilterValeurElmntLiquid(){
    this.innerTables1.forEach((table, index) => (table.dataSource as MatTableDataSource<ValeurElementLiquidation>).filter = "");
  }


}
