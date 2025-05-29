import { Component, OnInit, Input, EventEmitter, NgModule, ViewChild, ViewEncapsulation, Output } from '@angular/core';
import { SycadTableMetaData, SycadTableColonne, TypeColonne, FiltreRecherche, GenericActionEvent ,GenericAction, SycadTableContext, ActionProcessusEvent, MappingAPIParams} from '../model-table';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import {MatSelectModule, MatSelectChange} from '@angular/material/select';
import { MatDataTableSharedModule } from '@sycadApp/shared/material-modules/materialDataTableShared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GeneralGlobalSharedModule } from '@sycadApp/shared/generalShared.module';

import {merge, of as observableOf, Subject, Observable} from 'rxjs';
import {catchError, map, startWith, switchMap, mergeAll, takeUntil, debounceTime, filter, retry} from 'rxjs/operators';

import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FlexLayoutModule, MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatMenuModule } from '@angular/material/menu';
import { NgSelectModule } from '@ng-select/ng-select';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { FiltreRechercheAvanceService } from './filtre-service.service';
import { FilterColonnePipe, TransFormDisplayedColumnsPipe, TransListColumnFilterPipe, ShowBooleanValueFilterPipe, ShowColonneValuePipe } from '../pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { GenericDatasourceMock } from '@sycadApp/models/generic-datasource.mock';
import { GenericDatasource } from '@sycadApp/models/generic-datasource';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ThemePalette } from '@angular/material/core';
import { StatsExport, ExportService } from '@sycadApp/shared/directives/export.service';
import { Dossier } from '@sycadApp/models/workflow/common/general';
import { MatSnackBar } from '@angular/material/snack-bar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  suppressScrollX:false,
  suppressScrollY: false
};



@Component({
  selector: 'app-sycad-table',
  templateUrl: './sycad-table.component.html',
  styleUrls: ['./sycad-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  encapsulation: ViewEncapsulation.None
})
export class SycadTableComponent implements OnInit {

  primary: ThemePalette = 'primary';

@Input()
public tableDescription:SycadTableMetaData;

@Input()
public backendApiService: {
  search(context: SycadTableContext<any>): Observable<SycadTableContext<any>>;
  mapping: MappingAPIParams;
};
//public backendApiService:GenericDatasourceMock<any>|GenericDatasource<any,any,any>;

public contextTable :SycadTableContext<any> = new SycadTableContext()

@Input()
public actions:GenericAction[];

@Input()
public refeshDataSubject: Subject<string>;

  @ViewChild(MatPaginator, {static: true})
  public paginator: MatPaginator;

  @ViewChild(MatSort, {static: true})
  public sort: MatSort;


  @Output()
  public onAddData : EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public onEditData : EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public onDeleteData : EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public onActionElementData : EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public onAffectionData : EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public onGererCompte : EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public onViewProfil : EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public onPreviewData : EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public onFinishExport : EventEmitter<StatsExport> = new EventEmitter<StatsExport>();

  @Output()
  public onGenericAction : EventEmitter<GenericActionEvent> = new EventEmitter<GenericActionEvent>();

  @Output()
  public onActionProcessu : EventEmitter<ActionProcessusEvent> = new EventEmitter<ActionProcessusEvent>();

  public executeGeneriqueAction($event) {
    this.confirmService.confirm({
      title:"Confirmation",
      message:`Voulez-vous exécuter l'action : ${$event.libelle} sur les éléments sélectionnés`
    }).subscribe(($choix)=> {
      if($choix===true) {
        let action = new GenericActionEvent();
        action.data=this.selectionColonne.selected;
        action.name=$event;
        this.onGenericAction.emit(action);
      }
    });
  }


  public executeActionProcessus($event,dossier: Dossier) {
    let action= new ActionProcessusEvent($event,dossier.numero);
    this.onActionProcessu.emit(action);
  }
  public imprimerDocumentDossier(dossier: Dossier) {
 this.exportService.exportDocumentProcessus(dossier.numero,(event: StatsExport)=>{
  this._snackBar.open(`Document produit avec succès. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
    duration: 4000
  });
})
  }


  private _onDestroy = new Subject<void>();

  public displayedColumns: string[];

  public dataSource: MatTableDataSource<any>;

  public expandedElement: SycadTableColonne | null;

  public resultsLength = 0;
  public isLoadingResults = true;
  public isRateLimitReached = false;

  constructor( private mediaObserver: MediaObserver,public exportService:ExportService,private _snackBar: MatSnackBar, public confirmService:AppConfirmService, private router: Router,private route: ActivatedRoute, public filtreRechercheAvance: FiltreRechercheAvanceService) {
    this.dataSource = new MatTableDataSource();
   }
   public activeMediaQuery = '';

   ngAfterContentInit() {
     this.mediaObserver.media$.subscribe((change: MediaChange) => {
       this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
     //  console.log("this.activeMediaQuery", this.activeMediaQuery)
     });
   }
  ngOnInit(): void {

    if(this.tableDescription.isAdvancedSearch) {
      this.filtreRechercheRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.filtreRechercheAvance);
    }


    this.displayedColumns=this.getListColonnePivot();
  this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

  this.route.queryParamMap.subscribe(params => {

    if(params.has(this.backendApiService.mapping.pageName)) {
      this.paginator.pageIndex= Number(params.get(this.backendApiService.mapping.pageName));
    }
    if(params.has(this.backendApiService.mapping.limitName)) {
      this.paginator.pageSize= Number(params.get(this.backendApiService.mapping.limitName));
    }

    if(params.has(this.backendApiService.mapping.sortName)) {
      this.sort.active=params.get(this.backendApiService.mapping.sortName);
      this.sort.direction=(params.get(this.backendApiService.mapping.orderName)==="asc")?"asc":"desc";
    }

    if(params.has(this.backendApiService.mapping.searchName)) {
      this.tableDescription.globalFilter=params.get(this.backendApiService.mapping.searchName);
    }

    this.tableDescription.colonnes.forEach(colonne => {

      let keyName=null;
      if(params.has( colonne.name+""+this.backendApiService.mapping.searchColonneSuffix)) {
        keyName=colonne.name;
      }else if(params.has( colonne.nameFilter+""+this.backendApiService.mapping.searchColonneSuffix)) {
        keyName=colonne.nameFilter;
      }
      if(keyName!==null) {
        if(colonne.type===TypeColonne.BOOLEAN){
          let value=params.get(keyName+""+this.backendApiService.mapping.searchColonneSuffix);
          if(!value) colonne.filterValue=null;
          colonne.filterValue=(value==="true")?true:false;
        }else {
          colonne.filterValue=params.get(keyName+""+this.backendApiService.mapping.searchColonneSuffix);
        }

      }
    });

    //console.log(this.tableDescription.colonnes)

  });


     merge(this.refeshDataSubject,merge(merge(this.sort.sortChange, this.paginator.page), merge(this.colonneSearchTermSubject,this.globalsearchTermSubject)))
      .pipe(
      //  retry(2),
        takeUntil(this._onDestroy),
        debounceTime(750),
        startWith({}),
        filter(data=> {

        let fcol=false;
        for (let i = 0; i < this.tableDescription.colonnes.length; i++) {
          let colonne = this.tableDescription.colonnes[i];
          fcol = (colonne.filterValue && colonne.filterValue.toString().length>2)?true:false;
          if(fcol) break ;
        }


          if(this.tableDescription.globalFilter.length<=1 && this.tableDescription.globalFilter.length!==0 && fcol===false) {
            this.isLoadingResults = false;
            this.isRateLimitReached = false;
            return false;
          }


          return true;
        }),
        switchMap(() => {

          this.isLoadingResults = true;


          this.contextTable.search=this.tableDescription.globalFilter;
          this.contextTable.sort=this.sort.active;
          this.contextTable.order=this.sort.direction;
          this.contextTable.limit=this.paginator.pageSize;
          this.contextTable.page=this.paginator.pageIndex;
          this.contextTable.filters=this.getSearchByColumn();


          return this.backendApiService.search(this.contextTable).pipe(
            map(context => {
              // Flip flag to show that loading has finished.

              this.isLoadingResults = false;
              this.isRateLimitReached = false;
              this.resultsLength = context.totalCount;
              return context.items;
            }),
            catchError((err) => {
              console.log(err)
              this.isLoadingResults = false;
              this.isRateLimitReached = true;
              return observableOf([]);
            })
          );
        }),

      ).subscribe(data => {
        this.dataSource.data = data;

        if(!this.tableDescription.nestedTable) {
          let queryParams = {};
          queryParams[this.backendApiService.mapping.pageName]=this.paginator.pageIndex;
          queryParams[this.backendApiService.mapping.limitName]=this.paginator.pageSize;

          if(this.sort.active) {
            queryParams[this.backendApiService.mapping.sortName]=this.contextTable.sort;
            queryParams[this.backendApiService.mapping.orderName]=this.contextTable.order;
          }

          if(this.contextTable.search) {
            queryParams[this.backendApiService.mapping.searchName]=this.contextTable.search;
          }


          this.contextTable.filters.forEach((value,key) => {
            queryParams[key+this.backendApiService.mapping.searchColonneSuffix]=value;
        });
        this.router.navigate([], { relativeTo: this.route, queryParams:  queryParams });
        }


      });



  }


  public filtreRechercheRemoteAutocomplete = new RemoteAutocomplete<FiltreRecherche>();
  public onSearchFiltreRechercheAvance(eventNgSelect) {
    this.filtreRechercheRemoteAutocomplete.term.next(eventNgSelect.term);
 }


  /*  global search */
  public getSearchByColumn() : Map<string, string|boolean>{
    let map = new Map<string, string|boolean>();
    this.tableDescription.colonnes.forEach(colonne => {
      if(colonne.filterValue!=="" && colonne.filterValue!==undefined && colonne.filterValue!==null) {
        if(colonne.nameFilter){
          map.set(colonne.nameFilter,colonne.filterValue);
        }else {
          map.set(colonne.name,colonne.filterValue);
        }

      }

    });
    return map;
  }
  public colonneSearchTermSubject: Subject<string> = new Subject<string>();
  public globalsearchTermSubject: Subject<string> = new Subject<string>();

  applyColumnFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.colonneSearchTermSubject.next(filterValue);
  }
  applyColumnFilterBoolean(event: MatSlideToggleChange) {
    const filterValue =event.checked;
    this.colonneSearchTermSubject.next(filterValue.toString());
  }

  clearColumnFilter(){
    this.colonneSearchTermSubject.next("");
  }
  clearGlobalFilter(){
    this.globalsearchTermSubject.next("");
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.globalsearchTermSubject.next(filterValue);

  }
    /* end  global search */



  /* selection de colonne */
  public selectionColonne = new SelectionModel<any>(true, []);
    isAllSelected() {
      if(!this.dataSource) return ;
      const numSelected = this.selectionColonne.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
    masterToggle() {
      this.isAllSelected() ?
          this.selectionColonne.clear() :
          this.dataSource.data.forEach(row => this.selectionColonne.select(row));
    }
    checkboxLabel(row?: any): string {
      if (!row) {
        return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      }
      return `${this.selectionColonne.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

  /* fin selection de colonne */


  public onDeleteEvent($event) {
    this.confirmService.confirm({
      title:"Confirmation",
      message:`Voulez-vous faire la suppression de cet élément ?`
    }).subscribe(($choix)=> {
      if($choix===true) {
        this.onDeleteData.emit($event);
      }
    });
  }
  public onActionElementEvent($event) {
    this.onActionElementData.emit($event);
  }


  public finishExport(event: StatsExport) {
    this.onFinishExport.emit(event);

  }
  onDisplayedColumnsChange($event : MatSelectChange) {
    let selected = $event.value;
    this.tableDescription.colonnes=this.tableDescription.colonnes.slice(0);
    this.tableDescription.colonnes.forEach(el => {
      if(selected.indexOf(el.name)>=0) {
       el.show=true;
      }else {
       el.show=false;
      }
     });
   }

  public getListColonnePivot() {
    let list= this.tableDescription.colonnes.filter(el =>el.show).map(el => el.name);
    return list;
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  refreshTableau() {
    this.refeshDataSubject.next("");
  }
}



@NgModule({
  declarations: [SycadTableComponent,FilterColonnePipe,ShowColonneValuePipe,TransFormDisplayedColumnsPipe,TransListColumnFilterPipe,ShowBooleanValueFilterPipe],
  providers: [
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    FiltreRechercheAvanceService
  ],
  imports: [MatDataTableSharedModule,MatCheckboxModule,MatButtonModule,MatSlideToggleModule,MatProgressSpinnerModule,MatGridListModule,MatMenuModule,NgSelectModule,GeneralGlobalSharedModule,FlexLayoutModule,MatSelectModule,MatButtonToggleModule,MatInputModule,MatIconModule,PerfectScrollbarModule,FormsModule,CommonModule]
})
export class SycadTableModule { }



