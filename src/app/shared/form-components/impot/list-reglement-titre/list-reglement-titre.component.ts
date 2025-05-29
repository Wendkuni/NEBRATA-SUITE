import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ReglementTitreRecette, TitreRecette } from '@sycadApp/models/impot/mode-reglement.model';

@Component({
  selector: 'app-list-reglement-titre',
  templateUrl: './list-reglement-titre.component.html',
  styleUrls: ['./list-reglement-titre.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ListReglementTitreComponent implements OnInit {



  @Input("titresRecette") titresRecette: TitreRecette[];

  public displayedColumnsTitre: string[] = ['numeroTitre','codeTitre','numeroTitreRecetteParent','montant','montantRestant', 'dateTitre','etatTitre','natureTitreRecette','typeTitreRecette','rumap'];
  public displayedColumnsReglement: string[] = ['numeroQuittance', 'dateReglement','montant','modeReglement'];
  public dataSourceTitre:MatTableDataSource<TitreRecette>;

  constructor( private cd: ChangeDetectorRef,  public _adapter: DateAdapter<any>) { }

  titreRecetteData: any[] = [];


  @ViewChild('outerSort', { static: true }) sort: MatSort;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<ReglementTitreRecette>>;
  expandedElement: TitreRecette | null;

  ngOnInit(): void {
    this._adapter.setLocale("fr");

    if(this.titresRecette) {

    this.titresRecette.forEach(titre => {
      if (titre.reglements && Array.isArray(titre.reglements) && titre.reglements.length) {
        this.titreRecetteData = [...this.titreRecetteData, {...titre, reglements: new MatTableDataSource(titre.reglements)}];
      } else {
        this.titreRecetteData = [...this.titreRecetteData, titre];
      }
    });

    this.dataSourceTitre= new MatTableDataSource(this.titreRecetteData);
    }

  }


  toggleRow(element: TitreRecette) {

    element.reglements && (element.reglements as MatTableDataSource<ReglementTitreRecette>).data?.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<ReglementTitreRecette>).sort = this.innerSort.toArray()[index]);
  }
  applyFilterTitre(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceTitre.filter = filterValue.trim().toLowerCase();
  }
  clearFilterTitre() {
    this.dataSourceTitre.filter ="";
  }
  applyFilterReglement(filterValue: string) {
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<ReglementTitreRecette>).filter = filterValue.trim().toLowerCase());
  }
  clearFilterReglement(){
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<ReglementTitreRecette>).filter = "");
  }

}
