import {
  Component,
  Input, OnChanges,
  OnInit, SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  PlanCadastralRegularisationElement
} from "@sycadApp/models/workflow/regularisation.model";
import {
  Document,
  Transition
} from "@sycadApp/models/workflow/common/general";
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute, Router} from "@angular/router";
import {DateAdapter} from "@angular/material/core";
import {
  environment
} from "../../../../../environments/environment";
import {
  SdSectionnementElement
} from "@sycadApp/models/workflow/sd-sectionnement.model";
import {
  MatPaginator,
  PageEvent
} from "@angular/material/paginator";
import {
  Section
} from "@sycadApp/models/data-references/contribuables/global.model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-vue-sd-sectionnement',
  templateUrl: './vue-sd-sectionnement.component.html',
  styleUrls: ['./vue-sd-sectionnement.component.scss']
})
export class VueSdSectionnementComponent implements OnInit,OnChanges{

  @Input()
  public noOpenActions: boolean=false;

  public sdSectionnementElement: SdSectionnementElement;
  public transition: Transition;
  public displayedColumnsPiece: string[] = ['categorie', 'reference', 'autorite', 'dateDelivrance', 'dateExpiration', 'imageUrl'];
  public dataSourcePiece = new MatTableDataSource();
  public displayedColumnsDocument: string[] = ['code', 'libelle', 'dateEdition','dateValidite','typeDocument','action'];
  public dataSourceDocument = new MatTableDataSource();

  public displayedColumnsSections: string[] = ['numero', 'numeroAncien','commune'];
  public displayedColumnsMandat: string[] = ['objet', 'debut', 'fin','reference', 'description', 'mandant','mandataire','action'];


  public dataSourceSectionsADesactive= new MatTableDataSource();
  public dataSourceMandat = new MatTableDataSource();
  public dataSourceSectionsAjouter = new MatTableDataSource();
  public dataSourceSectionsModifier = new MatTableDataSource();
  dataSourceSection = new MatTableDataSource<Section>([]);
  dataSource = new MatTableDataSource<Section>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSize = 10;
  pageIndex = 0;
  totalElements = 0;
  filterValue = '';
  onChange: any = (_: Number) => {};
  constructor(public route: ActivatedRoute, public router: Router,public _adapter: DateAdapter<any>, public _snackBar: MatSnackBar)
  {
    this.sdSectionnementElement = this.route.snapshot.data["sdSectionnement"];
    this.transition = this.route.snapshot.data["transition"];
  }

  get urlAction(){
    return `${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_SECTIONNEMENT}/edition`;
  }

  ngOnInit(): void {
    this._adapter.setLocale("fr");
    this.sortSectionsByNumero();
    this.dataSourcePiece.data = this.sdSectionnementElement.listPieces;
    this.dataSourceDocument.data = this.sdSectionnementElement.documents;
    this.dataSourceSectionsADesactive.data=this.sdSectionnementElement.sectionsADesactive;
    this.dataSourceSectionsAjouter.data=this.sdSectionnementElement.sectionsAAjouter;
    this.dataSourceSectionsModifier.data=this.sdSectionnementElement.sectionsAModifier;
    this.dataSource.data = this.sdSectionnementElement.sectionsAAjouter;
    this.dataSourceMandat.data=this.sdSectionnementElement.mandats;
    this.totalElements = this.dataSourceSectionsAjouter.data.length;
    this.updateDataSource();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  public get document(): Document{
    return (this.sdSectionnementElement.documents.length > 0 ) ? this.sdSectionnementElement.documents[0]:null;
  }
  updateDataSource(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataSourceSection.data = this.sdSectionnementElement.sectionsAAjouter.slice(startIndex, endIndex);
  }
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDataSource();
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Mettre à jour la datasource paginée avec les résultats filtrés
    const filteredData = this.dataSource.filteredData;
    this.dataSourceSection.data = filteredData.slice(0, this.pageSize); // adapter en fonction de la pagination
  }
  clearSearch(inputElement: HTMLInputElement) {
    this.filterValue = '';
    inputElement.value = '';
    this.applyFilter('');
  }
  sortSectionsByNumero(): void {
    this.sdSectionnementElement.sectionsAAjouter.sort((a, b) => {
      return a.numero.localeCompare(b.numero, undefined, {numeric: true});
    });
  }
}
