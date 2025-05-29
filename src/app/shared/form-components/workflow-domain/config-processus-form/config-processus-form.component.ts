import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {CategoriePieceProcessus, Processus} from '@sycadApp/models/workflow/common/general';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {DateAdapter} from '@angular/material/core';


@Component({
  selector: 'app-config-processus-form',
  templateUrl: './config-processus-form.component.html',
  styleUrls: ['./config-processus-form.component.scss']
})
export class ConfigProcessusFormComponent  implements OnInit {
  public loading = false;
  public dataSourceDestinations = new MatTableDataSource();
  public dataSourceCategoriePieces = new MatTableDataSource();
  public dataSourceTypeDocuments = new MatTableDataSource();
  public dataSourceEtatProcess = new MatTableDataSource();
  public dataSourceTransition = new MatTableDataSource();

  public displayedColumnsTransition: string[] = ['code', 'libelle', 'description'];
  public displayedColumnsEtat: string[] = ['code', 'libelle', 'description'];
  public displayedColumnsDestination: string[] = ['code', 'libelle', 'tutelle.nom'];
  public displayedColumnsTypeDocuements: string[] = ['code', 'libelle', 'estTitreFoncier', 'estTitreParcelle', 'actif'];
  public displayedColumnsCategoriePieces: string[] = ['categorie', 'libelle', 'exemplaire', 'obligatoire', 'estAffiche'];

  @Output()
  public onSelected: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  public frontendUrl: String;
  @Input()
  public processus: Processus;

  constructor(  public route: ActivatedRoute,
                public router: Router,
                public mediaObserver: MediaObserver,
                public _adapter: DateAdapter<any>)
  {
    this.processus = this.route.snapshot.data['processus'];
  }

  ngOnInit(): void {
    this._adapter.setLocale("fr");
    this.dataSourceDestinations.data = this.processus.destinations;
    this.dataSourceTypeDocuments.data = this.processus.typeDocuments;
    this.dataSourceCategoriePieces.data = this.processus.categoriePieces;
    this.dataSourceEtatProcess.data = this.processus.etats;
    this.dataSourceTransition.data = this.processus.transitions;

  }


  public  modifier(){
    this.router.navigate([`${this.frontendUrl}`]);
  }
}
