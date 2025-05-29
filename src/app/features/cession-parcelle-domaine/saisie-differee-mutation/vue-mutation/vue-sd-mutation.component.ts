import {ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Document, Transition} from '@sycadApp/models/workflow/common/general';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DateAdapter } from '@angular/material/core';
import { Ilot } from '@sycadApp/models/data-references/contribuables/global.model';
import { MatSort } from '@angular/material/sort';
import { IlotElement, ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MutationParcelle } from '@sycadApp/models/workflow/sd-mutation.model';
import {environment} from '../../../../../environments/environment';



@Component({
  selector: 'app-vue-sd-mutation',
  templateUrl: './vue-sd-mutation.component.html',
  styleUrls: ['./vue-sd-mutation.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class VueSdMutationComponent implements OnInit {
  @Input()
  public noOpenActions: boolean=false;
  get urlAction(){
    return `${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_MUTATION}/edition`;
  }
  public mutation: MutationParcelle;
    public transition: Transition;
  public displayedColumnsPiece: string[] = ['categorie', 'reference', 'autorite', 'dateDelivrance', 'dateExpiration', 'imageUrl'];
  public dataSourcePiece = new MatTableDataSource();
  public displayedColumnsDocument: string[] = ['code', 'libelle', 'dateEdition','dateValidite','typeDocument','action'];
  public displayedColumnsMandat: string[] = ['objet', 'debut', 'fin','reference', 'description', 'mandant','mandataire','action'];

  public dataSourceDocument = new MatTableDataSource();
  public dataSourceMandat = new MatTableDataSource();
  
  constructor(
    private cd: ChangeDetectorRef,
    public route: ActivatedRoute,
    public router: Router,
    public _adapter: DateAdapter<any>)
  {
    this.mutation = this.route.snapshot.data["mutation"];
    this.transition = this.route.snapshot.data["transition"];

  }
  ilotsData: any[] = [];
  ngOnInit(): void {
    this._adapter.setLocale("fr");


    this.dataSourcePiece.data = this.mutation.listPieces;
    this.dataSourceDocument.data = this.mutation.documents;
    this.dataSourceMandat.data= this.mutation.mandats;
    
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
    return (this.mutation.documents.length>0) ?this.mutation.documents[0]:null;
  }

}
