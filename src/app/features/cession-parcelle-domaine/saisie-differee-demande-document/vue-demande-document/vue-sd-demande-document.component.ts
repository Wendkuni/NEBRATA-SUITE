import {ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DateAdapter } from '@angular/material/core';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Ilot } from '@sycadApp/models/data-references/contribuables/global.model';
import { ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';
import {Document, Transition} from '@sycadApp/models/workflow/common/general';
import {DemandeDocument} from '@sycadApp/models/workflow/sd-demande-document.model';
import { environment } from 'environments/environment';



@Component({
  selector: 'app-vue-sd-demande-document',
  templateUrl: './vue-sd-demande-document.component.html',
  styleUrls: ['./vue-sd-demande-document.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class VueSdDemandeDocumentComponent implements OnInit {

  @Input()
  public noOpenActions: boolean=false;

  public demandeDocument: DemandeDocument;
  public transition: Transition;
  public displayedColumnsPiece: string[] = ['categorie', 'reference', 'autorite', 'dateDelivrance', 'dateExpiration', 'imageUrl'];
  public dataSourcePiece = new MatTableDataSource();
  public displayedColumnsMandat: string[] = ['actif', 'objet', 'description','reference',"debut","fin",'mandataire','pieceJointe'];
  public dataSourceMandat = new MatTableDataSource();
  constructor(
    private cd: ChangeDetectorRef,
    public route: ActivatedRoute,
    public router: Router,
    public _adapter: DateAdapter<any>)
  {
    this.demandeDocument = this.route.snapshot.data["demandeDocument"];
    this.transition = this.route.snapshot.data["transition"];

   // console.log("this.demandeDocument ",this.demandeDocument )
  }
  ilotsData: any[] = [];


  get urlAction(){
    return `${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DEMANDE_DOCUMENT }/edition`;
  }

  ngOnInit(): void {
    this._adapter.setLocale("fr");



    this.dataSourcePiece.data = this.demandeDocument.listPieces;
    this.dataSourceMandat.data = this.demandeDocument.mandats;
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
    return (this.demandeDocument.documents.length>0) ?this.demandeDocument.documents[0]:null;
  }
}
