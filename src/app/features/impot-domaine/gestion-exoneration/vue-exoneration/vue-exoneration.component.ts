import { trigger, state, style, transition, animate } from '@angular/animations';
import { ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Ilot } from '@sycadApp/models/data-references/contribuables/global.model';
import { ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';
import { ExonerationDossier } from '@sycadApp/models/impot/exoneration.model';
import { Transition, Document } from '@sycadApp/models/workflow/common/general';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-vue-exoneration',
  templateUrl: './vue-exoneration.component.html',
  styleUrls: ['./vue-exoneration.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class VueExonerationComponent implements OnInit {

  @Input()
  public noOpenActions: boolean=false;

  public exonerationDossier:ExonerationDossier;
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
      this.exonerationDossier = this.route.snapshot.data["exonerationDossier"];
      this.transition = this.route.snapshot.data["transition"];

      }
      ilotsData: any[] = [];

      get urlAction(){
        return `${environment.FRONTEND_ROUTES.PROCESSUS_EXONERATION}/edition`;
      }
  ngOnInit(): void {

    this._adapter.setLocale("fr");



    this.dataSourcePiece.data = this.exonerationDossier.listPieces;
    this.dataSourceDocument.data = this.exonerationDossier.documents;
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
    return (this.exonerationDossier.documents.length>0) ?this.exonerationDossier.documents[0]:null;
  }
}
