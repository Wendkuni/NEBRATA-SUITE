import {ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Document, Transition} from '@sycadApp/models/workflow/common/general';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DateAdapter } from '@angular/material/core';
import { Ilot } from '@sycadApp/models/data-references/contribuables/global.model';
import { MatSort } from '@angular/material/sort';
import { ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {environment} from '../../../../../environments/environment';
import { DelivranceAap } from '@sycadApp/models/workflow/sd-delivrance-aap.model';


@Component({
  selector: 'app-vue-sd-delivrance-aap',
  templateUrl: './vue-sd-delivrance-aap.component.html',
  styleUrls: ['./vue-sd-delivrance-aap.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class VueSdDelivranceAAPComponent implements OnInit {
  @Input()
  public noOpenActions: boolean=false;
  get urlAction(){
    return `${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DELIVRANCE_AAP}/edition`;
  }
  public delivranceAap: DelivranceAap;
  public transition: Transition;
  public displayedColumnsPiece: string[] = ['categorie', 'reference', 'autorite', 'dateDelivrance', 'dateExpiration', 'imageUrl'];
  public displayedColumnsMandat: string[] = ['objet', 'debut', 'fin','reference', 'description', 'mandant','mandataire','action'];
  public dataSourcePiece = new MatTableDataSource();
  public displayedColumnsDocument: string[] = ['code', 'libelle', 'dateEdition','dateValidite','typeDocument','action'];
 
  public dataSourceDocument = new MatTableDataSource();
  public dataSourceMandat = new MatTableDataSource();

  public dataSourceQuittance = new MatTableDataSource();
  public displayedColumnsQuittance: string[] = ['reference', 'date', 'montant'];
  selectedTabIndex: number = 0;
  selectedSubTabIndex: number = 0;

  constructor(
    private cd: ChangeDetectorRef,
    public route: ActivatedRoute,
    public router: Router,
    public _adapter: DateAdapter<any>)
  {
    this.delivranceAap = this.route.snapshot.data["delivranceAap"];
    this.transition = this.route.snapshot.data["transition"];

  }
  ilotsData: any[] = [];
  ngOnInit(): void {


    this._adapter.setLocale("fr");
    this.dataSourcePiece.data = this.delivranceAap.listPieces;
    this.dataSourceMandat.data= this.delivranceAap.mandats;
    this.dataSourceDocument.data = this.delivranceAap.documents;
    this.dataSourceQuittance.data = this.delivranceAap.quittances;
   
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab) {
        const parts = tab.split('.');
        this.selectedTabIndex = parts.length > 0 ? +parts[0] : 0;
        this.selectedSubTabIndex = parts.length > 1 ? +parts[1] : 0;
      } else {
        this.selectedTabIndex = 0;
        this.selectedSubTabIndex = 0;
      }
    });
  }

  @ViewChild('outerSort', { static: true }) sort: MatSort;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<ParcelleElement>>;
  expandedElement: Ilot | null;

  toggleRow(element: Ilot) {

    element.parcelles && (element.parcelles as MatTableDataSource<ParcelleElement>).data.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<ParcelleElement>).sort = this.innerSort.toArray()[index]);
  }
 
  public get document(): Document{
    return (this.delivranceAap.documents.length>0) ?this.delivranceAap.documents[0]:null;
  }

}
