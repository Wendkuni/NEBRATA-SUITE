import {ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  CessionParcelle,
  Document,
  Transition
} from '@sycadApp/models/workflow/common/general';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DateAdapter } from '@angular/material/core';
import {
  ContribuableElement, GeneralContribuable,
  Ilot
} from '@sycadApp/models/data-references/contribuables/global.model';
import { MatSort } from '@angular/material/sort';
import { ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AttributionParcelle } from '@sycadApp/models/workflow/sd-attribution.model';
import {environment} from '../../../../../environments/environment';
import {
  ContribuableService
} from "@sycadApp/services/data-references/system/contribuable.service";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {FormControl, FormGroup} from "@angular/forms";


@Component({
  selector: 'app-vue-sd-attribution',
  templateUrl: './vue-sd-attribution.component.html',
  styleUrls: ['./vue-sd-attribution.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class VueSdAttributionComponent implements OnInit {
  @Input()
  public noOpenActions: boolean=false;
  editorContent: string = '';
  get urlAction(){
    return `${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_ATTRIBUTION}/edition`;
  }
  public isloading= false;
  public attribution: AttributionParcelle;
  public transition: Transition;
  public displayedColumnsPiece: string[] = ['categorie', 'reference', 'autorite', 'dateDelivrance', 'dateExpiration', 'imageUrl'];
  public displayedColumnsMandat: string[] = ['objet', 'debut', 'fin','reference', 'description', 'mandant','mandataire','action'];
  public dataSourcePiece = new MatTableDataSource();
  public displayedColumnsDocument: string[] = ['code', 'libelle', 'dateEdition','dateValidite','typeDocument','action'];
  public listeAttributairesParcelleOccupe: (ContribuableElement | GeneralContribuable)[];
  public dataSourceDocument = new MatTableDataSource();
  public dataSourceMandat = new MatTableDataSource();
  public dossierRetour : CessionParcelle[];
  constructor(
    private cd: ChangeDetectorRef,
    public route: ActivatedRoute,
    public contribuableService: ContribuableService,
    public router: Router,
    public _adapter: DateAdapter<any>)
  {
    this.attribution = this.route.snapshot.data["attribution"];
    this.transition = this.route.snapshot.data["transition"];

   //// console.log("this.attribution ",this.attribution.parcelle )
  }
  ilotsData: any[] = [];
  formGroup: FormGroup;
  ngOnInit(): void {


    this._adapter.setLocale("fr");
    this.dataSourcePiece.data = this.attribution.listPieces;
    this.dataSourceMandat.data= this.attribution.mandats;
    this.dataSourceDocument.data = this.attribution.documents;
    this.getListeAttributairesParcelleOccupe(this.attribution.parcelle?.icad);
    this.formGroup = new FormGroup({
      observation: new FormControl(this.attribution?.observation || '')
    });
  }
  public getListeAttributairesParcelleOccupe(icad: string) {
    this.contribuableService.getListContribuableByIcad(icad).subscribe(data => {
      if(data){
        this.dossierRetour = data;
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
  get filteredDossiers() {
    return this.dossierRetour?.filter(dossier => dossier.numero !== this.attribution.numero);
  }
  public get document(): Document{
    return (this.attribution.documents.length>0) ?this.attribution.documents[0]:null;
  }
  editorConfig: AngularEditorConfig = {
    editable: false,
    spellcheck: true,
    height: "7rem",
    minHeight: "4rem",
    width: "auto",
    minWidth: "0",
    translate: "yes",
    enableToolbar: true,
    showToolbar: true,
    placeholder: "",
    defaultParagraphSeparator: "",
    defaultFontName: "",
    defaultFontSize: "",
    fonts: [
      { class: "arial", name: "Arial" },
      { class: "times-new-roman", name: "Times New Roman" },
      { class: "calibri", name: "Calibri" },
      { class: "comic-sans-ms", name: "Comic Sans MS" },
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: "redText",
        class: "redText",
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ],
    //uploadUrl: environment.APPLICATION.UPLOAD_FILE_API,
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: "top",
    toolbarHiddenButtons: [["bold", "italic"], ["fontSize"]],
  };
}
