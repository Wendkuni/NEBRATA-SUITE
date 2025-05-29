import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit, QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {Document, Transition} from '@sycadApp/models/workflow/common/general';
import {DateAdapter} from '@angular/material/core';
import {
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {PlanCadastralRegularisationElement} from '@sycadApp/models/workflow/regularisation.model'
import { environment } from 'environments/environment';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import {MatSort} from "@angular/material/sort";
import {
  IlotElement,
  ParcelleElement
} from "@sycadApp/models/data-references/territoire/localite.model";
import {
  Ilot
} from "@sycadApp/models/data-references/contribuables/global.model";
import {
  MatPaginator,
  PageEvent
} from "@angular/material/paginator";


@Component({
  selector: 'app-vue-vue-sd-maj-plan',
  templateUrl: './vue-sd-maj-plan.component.html',
  styleUrls: ['./vue-sd-maj-plan.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class VueSdMajPlanComponent implements OnInit {

  @Input()
  public noOpenActions: boolean=false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public planCadastral: PlanCadastralRegularisationElement;
  public transition: Transition;
  public displayedColumnsPiece: string[] = ['categorie', 'reference', 'autorite', 'dateDelivrance', 'dateExpiration', 'imageUrl'];
  public dataSourcePiece = new MatTableDataSource();
  public displayedColumnsDocument: string[] = ['code', 'libelle', 'dateEdition','dateValidite','typeDocument','action'];
  public dataSourceDocument = new MatTableDataSource();
  public dataSourceIlot:MatTableDataSource<IlotElement>;
  public dataSourceIlotA:MatTableDataSource<IlotElement>;

  public displayedColumnsIlots: string[] = ['numero', 'numeroAncien','numeroSection','numeroAncienSection'];
  public displayedColumnsMandat: string[] = ['objet', 'debut', 'fin','reference', 'description', 'mandant','mandataire','action'];
  public displayedColumnsAdesativer: string[] = ['icad','numero', 'libelle', 'etatMev','destination','superficie','etatAttribution','numeroIlot','arrondissement','commune','localite'];
  public displayedColumnsAajouter: string[] = ['icad','numero', 'libelle', 'etatMev','destination','superficie','etatAttribution','numeroIlot','arrondissement','commune','localite'];
  public displayedColumnsAmodifier: string[] = ['icad','numero', 'libelle', 'etatMev','destination','superficie','etatAttribution','numeroIlot','arrondissement','commune','localite'];
  public displayedColumnsParcelle: string[] = ['icad','numero', 'numeroAncien','superficie','etatAttribution','etatMev',"destination","localite","arrondissement","quartier"];

  public dataSourceIlotAdesactiver=new MatTableDataSource();
  public dataSourceMandat = new MatTableDataSource();
  public dataSourceParcAdesativer = new MatTableDataSource();
  public dataSourceIlotsAjouter = new MatTableDataSource();
  public dataSourceIlotsModifier = new MatTableDataSource();
  public dataSourceParcAajouter = new MatTableDataSource();
  public dataSourceParcAmodifier = new MatTableDataSource();
  @ViewChild('outerSort', { static: true })
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<ParcelleElement>>;
  expandedElement: Ilot | null;
  ilotsData: any[] = [];
  pageSize = 10;
  pageIndex = 0;
  totalElements = 0;
  filterValue = '';
  constructor(private cd: ChangeDetectorRef,public route: ActivatedRoute, public router: Router,public _adapter: DateAdapter<any>)
  {
    this.planCadastral = this.route.snapshot.data["sdMaj"];
    this.transition = this.route.snapshot.data["transition"];
  }

  get urlAction(){
    return `${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MAJ_PLAN_CADASTRE}/edition`;
  }
  ngOnInit(): void {
    this._adapter.setLocale("fr");
    this.planCadastral.ilotsAAjouter.forEach(ilot => {
      if (ilot.parcelles && Array.isArray(ilot.parcelles) && ilot.parcelles?.length) {
        this.ilotsData = [...this.ilotsData, {...ilot, parcelles: new MatTableDataSource(ilot.parcelles)}];
      } else {
        this.ilotsData = [...this.ilotsData, ilot];
      }
    });
    this.dataSourcePiece.data = this.planCadastral.listPieces;
    this.dataSourceDocument.data = this.planCadastral.documents;
    this.dataSourceIlotAdesactiver.data= this.planCadastral.ilotsADesactive;
    this.dataSourceIlotsAjouter.data=this.planCadastral.ilotsAAjouter;
    this.dataSourceIlotsModifier.data=this.planCadastral.ilotsAModifier;
    this.dataSourceParcAdesativer.data=this.planCadastral.parcellesADesactiver;
    this.dataSourceParcAajouter.data=this.planCadastral.parcellesAAjouter;
    this.dataSourceParcAmodifier.data=this.planCadastral.parcellesAModifier;
    this.dataSourceMandat.data=this.planCadastral.mandats;
    this.sortIlotsByNumero();
    this.dataSourceIlotA= new MatTableDataSource(this.ilotsData);
    this.dataSourceIlot= new MatTableDataSource(this.ilotsData);
    this.totalElements = this.dataSourceIlot.data.length;
    this.dataSourceIlot.paginator = this.paginator; // Connectez la datasource au paginator
    this.dataSourceIlot.sort = this.sort; // Connectez la datasource au tri si vous avez un MatSort
    this.updateDataSource();
  }
  toggleRow(element: Ilot) {

    element.parcelles && (element.parcelles as MatTableDataSource<ParcelleElement>).data?.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<ParcelleElement>).sort = this.innerSort.toArray()[index]);
  }
  applyFilterIlot(filterValue: string) {
    this.dataSourceIlotA.filter = filterValue.trim().toLowerCase();

    // Mettre à jour la datasource paginée avec les résultats filtrés
    const filteredData = this.dataSourceIlotA.filteredData;
    this.dataSourceIlot.data = filteredData.slice(0, this.pageSize);
  }

  // const filterValue = (event.target as HTMLInputElement).value;
  // this.dataSourceIlot.filter = filterValue.trim().toLowerCase();
  clearFilterIlot() {
    this.dataSourceIlot.filter ="";
  }
  applyFilterParcelle(filterValue: string) {
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<ParcelleElement>).filter = filterValue.trim().toLowerCase());
  }
  clearFilterParcelle(){
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<ParcelleElement>).filter = "");
  }


  public get document(): Document{
    return (this.planCadastral.documents.length>0) ?this.planCadastral.documents[0]:null;
  }
  updateDataSource(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataSourceIlot.data = this.ilotsData.slice(startIndex, endIndex);
  }
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDataSource();
  }
  sortIlotsByNumero(): void {
    this.ilotsData.sort((a, b) => {
      return a.numero.localeCompare(b.numero, undefined, {numeric: true});
    });
  }
}
