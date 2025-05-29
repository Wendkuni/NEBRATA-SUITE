import {ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Document, Transition} from '@sycadApp/models/workflow/common/general';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DateAdapter } from '@angular/material/core';
import { Ilot } from '@sycadApp/models/data-references/contribuables/global.model';
import { MatSort } from '@angular/material/sort';
import { IlotElement, ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AttributionParcelle } from '@sycadApp/models/workflow/sd-attribution.model';
import {environment} from '../../../../../environments/environment';

import { EntetePV } from '@sycadApp/models/workflow/sd-entete-pv.model';
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {FormControl, FormGroup} from "@angular/forms";


@Component({
  selector: 'app-vue-saisie-attribution',
  templateUrl: './vue-saisie-attribution.component.html',
  styleUrls: ['./vue-saisie-attribution.component.scss']
})
export class VueSaisieAttributionComponent implements OnInit {

  @Input()
  public noOpenActions: boolean=false;
  get urlAction(){
    return `${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_PV_ATTRIBUTION}/edition`;
  }
  public entetePV: EntetePV;
  public transition: Transition;
  public displayedColumnsPiece: string[] = ['categorie', 'reference', 'autorite', 'dateDelivrance', 'dateExpiration', 'imageUrl'];
  public displayedColumnsMandat: string[] = ['objet', 'debut', 'fin','reference', 'description', 'mandant','mandataire','action'];
  public dataSourcePiece = new MatTableDataSource();
  public displayedColumnsDocument: string[] = ['code', 'libelle', 'dateEdition','dateValidite','typeDocument','action'];

  public displayedColumnsIlos: string[] = ['numero', 'numeroAncien', 'section'];
  public dataSourceIlos = new MatTableDataSource();

  public dataSourceDocument = new MatTableDataSource();
  public dataSourceMandat = new MatTableDataSource();
  constructor(
    private cd: ChangeDetectorRef,
    public route: ActivatedRoute,
    public router: Router,
    public _adapter: DateAdapter<any>)
  {
    this.entetePV = this.route.snapshot.data["entetePV"];
    this.transition = this.route.snapshot.data["transition"];

   //// console.log("this.attribution ",this.attribution.parcelle )
  }
  formGroup: FormGroup;
  ilotsData: any[] = [];
  ngOnInit(): void {


    this._adapter.setLocale("fr");
    this.dataSourcePiece.data = this.entetePV.listPieces;
    this.dataSourceMandat.data= this.entetePV.mandats;
    this.dataSourceDocument.data = this.entetePV.documents;
    this.formGroup = new FormGroup({
      observation: new FormControl(this.entetePV?.observation || '')
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
    return (this.entetePV.documents.length>0) ?this.entetePV.documents[0]:null;
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
