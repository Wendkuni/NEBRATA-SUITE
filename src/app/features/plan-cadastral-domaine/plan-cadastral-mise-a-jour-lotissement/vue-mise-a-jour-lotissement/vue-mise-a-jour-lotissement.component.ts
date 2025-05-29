import {Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {PlanCadastralMAJLotissementElement} from '@sycadApp/models/workflow/maj-lotissement.model';
import {ActivatedRoute, Router} from '@angular/router';

import {Document, Transition} from '@sycadApp/models/workflow/common/general';
import {DateAdapter} from '@angular/material/core';
import {MatTableDataSource} from '@angular/material/table';
import { IlotElement } from '@sycadApp/models/data-references/territoire/localite.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-vue-mise-a-jour-lotissement',
  templateUrl: './vue-mise-a-jour-lotissement.component.html',
  styleUrls: ['./vue-mise-a-jour-lotissement.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class VueMiseAJourLotissementComponent implements OnInit {
  @Input()
  public noOpenActions: boolean=false;
  get urlAction(){
    return `${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MAJ_PLAN_CADASTRE}/edition`;
  }
  public planCadastral: PlanCadastralMAJLotissementElement;
  public transition: Transition;
  public displayedColumnsPiece: string[] = ['categorie', 'reference', 'autorite', 'dateDelivrance', 'dateExpiration', 'imageUrl'];
  public dataSourcePiece = new MatTableDataSource();
  public displayedColumnsDocument: string[] = ['code', 'libelle', 'dateEdition','dateValidite','typeDocument','action'];
  public dataSourceDocument = new MatTableDataSource();
  public dataSourceSectionsAjouter=new MatTableDataSource();
  public dataSourceSectionsModifier=new MatTableDataSource();
  public dataSourceIlotsAjouter=new MatTableDataSource();
  public dataSourceIlotsModifier=new MatTableDataSource();
  
  public displayedColumnsSections: string[] = ['numero', 'numeroAncien'];
  public displayedColumnsIlots: string[] = ['numero', 'numeroAncien','numeroSection','numeroAncienSection'];
  public displayedColumnsMandat: string[] = ['objet', 'debut', 'fin','reference', 'description', 'mandant','mandataire','action'];
  public displayedColumnsAdesativer: string[] = ['icad','numero', 'libelle', 'etatMev','destination','superficie','etatAttribution','numeroIlot','arrondissement','commune','localite'];
  public displayedColumnsAajouter: string[] = ['icad','numero', 'libelle', 'etatMev','destination','superficie','etatAttribution','numeroIlot','arrondissement','commune','localite'];
  public displayedColumnsAmodifier: string[] = ['icad','numero', 'libelle', 'etatMev','destination','superficie','etatAttribution','numeroIlot','arrondissement','commune','localite'];

  
  public dataSourceSections= new MatTableDataSource();
  public dataSourceIlot=new MatTableDataSource();
  public dataSourceMandat = new MatTableDataSource();
  public dataSourceParcAdesativer = new MatTableDataSource();
  public dataSourceParcAajouter = new MatTableDataSource();
  public dataSourceParcAmodifier = new MatTableDataSource();
  constructor(public route: ActivatedRoute, public router: Router,public _adapter: DateAdapter<any>)
  {
    this.planCadastral = this.route.snapshot.data["majLotissement"];
    this.transition = this.route.snapshot.data["transition"];
  }

  ngOnInit(): void {
    this._adapter.setLocale("fr");
  
    this.dataSourcePiece.data = this.planCadastral.listPieces;
    this.dataSourceDocument.data = this.planCadastral.documents;

    this.dataSourceSections.data=this.planCadastral.sectionsADesactive;
    this.dataSourceIlot.data= this.planCadastral.ilotsADesactive;
    this.dataSourceParcAdesativer.data=this.planCadastral.parcellesADesactive;
    this.dataSourceParcAajouter.data=this.planCadastral.parcellesAAjouter;
    this.dataSourceParcAmodifier.data=this.planCadastral.parcellesAModifier;
    this.dataSourceMandat.data=this.planCadastral.mandats;

    this.dataSourceSectionsAjouter.data=this.planCadastral.sectionsAAjouter;
    this.dataSourceSectionsModifier.data=this.planCadastral.sectionsAModifier;
    this.dataSourceIlotsAjouter.data=this.planCadastral.ilotsAAjouter;
    this.dataSourceIlotsModifier.data=this.planCadastral.ilotsAModifier;
  }
  public get document(): Document{
    return (this.planCadastral.documents.length>0) ?this.planCadastral.documents[0]:null;
  }
}
