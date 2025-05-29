import {ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Document, Transition} from '@sycadApp/models/workflow/common/general';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DateAdapter } from '@angular/material/core';
import { Ilot } from '@sycadApp/models/data-references/contribuables/global.model';
import { MatSort } from '@angular/material/sort';
import { IlotElement, ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { RetraitParcelle } from '@sycadApp/models/workflow/sd-retrait.model';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-vue-sd-retrait',
  templateUrl: './vue-sd-retrait.component.html',
  styleUrls: ['./vue-sd-retrait.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class VueSdRetraitComponent implements OnInit {

  @Input()
  public noOpenActions: boolean=false;

  public retrait: RetraitParcelle;
  public transition: Transition;
  public displayedColumnsPiece: string[] = ['categorie', 'reference', 'autorite', 'dateDelivrance', 'dateExpiration', 'imageUrl'];
  public dataSourcePiece = new MatTableDataSource();
  public displayedColumnsDocument: string[] = ['code', 'libelle', 'dateEdition','dateValidite','typeDocument','action'];
  public dataSourceDocument = new MatTableDataSource();

  

  constructor(
    private cd: ChangeDetectorRef,
    public route: ActivatedRoute,
    public router: Router,
    public _adapter: DateAdapter<any>)
  {
    this.retrait = this.route.snapshot.data["retrait"];
    this.transition = this.route.snapshot.data["transition"];

    //console.log("this.retrait ",this.retrait.parcelle )
  }
  ilotsData: any[] = [];


  get urlAction(){
    return `${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_RETRAIT}/edition`;
  }
  ngOnInit(): void {
   //// console.log(this.retrait);
    this._adapter.setLocale("fr");


    this.dataSourcePiece.data = this.retrait.listPieces;
    this.dataSourceDocument.data = this.retrait.documents;
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
    return (this.retrait.documents.length>0) ?this.retrait.documents[0]:null;
  }

}
