import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Exoneration } from '@sycadApp/models/evaluation/exoneration.model';
import { Impot, ReglementTitreRecette, TitreRecette } from '@sycadApp/models/impot/mode-reglement.model';

@Component({
  selector: 'app-list-impot-exoneration',
  templateUrl: './list-impot-exoneration.component.html',
  styleUrls: ['./list-impot-exoneration.component.scss']
})
export class ListImpotExonerationComponent implements OnInit {


  @Input("titresRecette") titresRecette: TitreRecette[];

  displayedColumnsExoneration: string[] = ['natureImpot','typeNatureImpot', 'montant', 'taux', 'dateDebut','dateFin','motif'];
 
  public dataSourceExoneration:MatTableDataSource<Exoneration>;

  constructor( public _adapter: DateAdapter<any>) { }


  ngOnInit(): void {
    this._adapter.setLocale("fr");

    if(this.titresRecette) {
   
    let arrayOrArrayImpot = this.titresRecette.map(titre =>titre.impots.map(impot=>impot.exonerations));
    let exonerations1 =  arrayOrArrayImpot.reduce((acc, val) => acc.concat(val), []);
    let exonerations2 =  exonerations1.reduce((acc, val) => acc.concat(val), []);
    this.dataSourceExoneration= new MatTableDataSource(exonerations2);
    }

  }


}
