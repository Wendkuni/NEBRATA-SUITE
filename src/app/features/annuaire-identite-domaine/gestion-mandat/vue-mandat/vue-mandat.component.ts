import { trigger, state, style, transition, animate } from '@angular/animations';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {MandatElem, MandatElement} from '@sycadApp/models/workflow/common/general';
import {Document, Transition} from '@sycadApp/models/workflow/common/general';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-vue-mandat',
  templateUrl: './vue-mandat.component.html',
  styleUrls: ['./vue-mandat.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class VueMandatComponent implements OnInit {

  @Input()
  public noOpenActions: boolean=false;

  public mandat: MandatElem;
  public transition: Transition;
  public displayedColumnsPiece: string[] = ['categorie', 'reference', 'autorite', 'dateDelivrance', 'dateExpiration', 'imageUrl'];
  public dataSourcePiece = new MatTableDataSource();
  public displayedColumnsDocument: string[] = ['code', 'libelle', 'dateEdition','dateValidite','typeDocument','action'];
  public dataSourceDocument = new MatTableDataSource();
  constructor(  private cd: ChangeDetectorRef,
                public route: ActivatedRoute,
                public router: Router,
                public _adapter: DateAdapter<any>)
  {
    this.mandat = this.route.snapshot.data["mandat"];
    this.transition = this.route.snapshot.data["transition"];
  }

  get urlAction(){
    return `${environment.FRONTEND_ROUTES.PROCESSUS_MANDAT}/edition`;
  }

  ngOnInit(): void {
    this._adapter.setLocale("fr");

    this.dataSourcePiece.data = this.mandat.listPieces;
    this.dataSourceDocument.data = this.mandat.documents;
  }
  public get document(): Document{
    return (this.mandat.documents.length>0) ? this.mandat.documents[0]:null;
  }

}
