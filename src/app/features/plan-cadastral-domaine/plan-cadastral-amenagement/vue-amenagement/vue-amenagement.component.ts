import {ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {Document, Transition} from '@sycadApp/models/workflow/common/general';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DateAdapter } from '@angular/material/core';
import { Ilot } from '@sycadApp/models/data-references/contribuables/global.model';
import { MatSort } from '@angular/material/sort';
import { IlotElement, ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {PlanCadastralAmenagementElement} from '@sycadApp/models/workflow/cp-amenagement.model';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-vue-amenagement',
  templateUrl: './vue-amenagement.component.html',
  styleUrls: ['./vue-amenagement.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class VueAmenagementComponent implements OnInit {
  @Input()
  public noOpenActions: boolean=false;
  get urlAction(){
    return `${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_AMENAGEMENT}/edition`;
  }
  public planCadastral: PlanCadastralAmenagementElement;
  public displayedColumnsIlots: string[] = ['numero', 'numeroAncien','numeroSection','numeroAncienSection'];
  public displayedColumnsParcelle: string[] = ['numero', 'numeroAncien','icad','superficie','etatAttribution','etatMev',"destination","localite"];
  public dataSourceIlot:MatTableDataSource<IlotElement>;
  public transition: Transition;
  public displayedColumnsPiece: string[] = ['categorie', 'reference', 'autorite', 'dateDelivrance', 'dateExpiration', 'imageUrl'];
  public dataSourcePiece = new MatTableDataSource();
  public dataSourceSections = new MatTableDataSource();
  public displayedColumnsDocument: string[] = ['code', 'libelle', 'dateEdition','dateValidite','typeDocument','action'];
  public dataSourceDocument = new MatTableDataSource();
  constructor(
    private cd: ChangeDetectorRef,
    public route: ActivatedRoute,
    public router: Router,
    public _adapter: DateAdapter<any>)
  {
    this.planCadastral = this.route.snapshot.data["planCadastral"];
    this.transition = this.route.snapshot.data["transition"];
  }
  ilotsData: any[] = [];
  ngOnInit(): void {
    this._adapter.setLocale("fr");


    this.planCadastral.ilots.forEach(ilot => {
      if (ilot.parcelles && Array.isArray(ilot.parcelles) && ilot.parcelles?.length) {
        this.ilotsData = [...this.ilotsData, {...ilot, parcelles: new MatTableDataSource(ilot.parcelles)}];
      } else {
        this.ilotsData = [...this.ilotsData, ilot];
      }
    });

    this.dataSourceIlot= new MatTableDataSource(this.ilotsData);
    this.dataSourcePiece.data = this.planCadastral.listPieces;
    this.dataSourceDocument.data = this.planCadastral.documents;
  }

  @ViewChild('outerSort', { static: true }) sort: MatSort;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<ParcelleElement>>;
  expandedElement: Ilot | null;

  toggleRow(element: Ilot) {
    //console.log("element ilot",element)
    element.parcelles && (element.parcelles as MatTableDataSource<ParcelleElement>).data?.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<ParcelleElement>).sort = this.innerSort.toArray()[index]);
  }
  applyFilterIlot(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceIlot.filter = filterValue.trim().toLowerCase();
  }
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
    return (this.planCadastral.documents?.length>0) ?this.planCadastral.documents[0]:null;
  }

}
