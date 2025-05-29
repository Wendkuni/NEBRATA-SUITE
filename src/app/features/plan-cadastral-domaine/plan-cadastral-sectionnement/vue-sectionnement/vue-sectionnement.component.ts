import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PlanCadastralSectionnementElement} from '@sycadApp/models/workflow/common/sectionnement.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Document, Transition} from '@sycadApp/models/workflow/common/general';
import { DateAdapter } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-vue-sectionnement',
  templateUrl: './vue-sectionnement.component.html',
  styleUrls: ['./vue-sectionnement.component.scss']
})
export class VueSectionnementComponent implements OnInit {

  @Input() 
  public noOpenActions: boolean=false;


  public planCadastral: PlanCadastralSectionnementElement;
  public displayedColumnsSections: string[] = ['numero', 'numeroAncien'];
  public displayedColumnsPiece: string[] = ['categorie', 'reference', 'autorite', 'dateDelivrance', 'dateExpiration', 'imageUrl'];
  public dataSourcePiece = new MatTableDataSource();
  public dataSourceSections = new MatTableDataSource();
  public displayedColumnsDocument: string[] = ['code', 'libelle', 'dateEdition','dateValidite','typeDocument','action'];
  public dataSourceDocument = new MatTableDataSource();
  public transition: Transition;
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public _adapter: DateAdapter<any>)
  {
    this.planCadastral = this.route.snapshot.data["planCadastral"];
    this.transition = this.route.snapshot.data["transition"];
  }
  get urlAction(){
    return `${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_SECTIONNEMENT}/edition`;
  }

  ngOnInit(): void {
    this._adapter.setLocale("fr");

    this.dataSourceSections.data=this.planCadastral.sections;
    this.dataSourcePiece.data = this.planCadastral.listPieces;
    this.dataSourceDocument.data = this.planCadastral.documents;
  }

  public get document(): Document{
    return (this.planCadastral.documents.length>0) ?this.planCadastral.documents[0]:null;
  }



  applyFilterSections(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceSections.filter = filterValue.trim().toLowerCase();
  }
  clearFilterSections() {
    this.dataSourceSections.filter ="";
  }
}
