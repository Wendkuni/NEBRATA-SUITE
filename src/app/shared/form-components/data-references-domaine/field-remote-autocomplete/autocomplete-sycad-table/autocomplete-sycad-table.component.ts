import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
  Inject
} from '@angular/core';
import {Observable, Subject, merge, of as observableOf} from 'rxjs';
import {HttpResponse} from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, debounceTime, filter, map, startWith, switchMap, takeUntil} from 'rxjs/operators';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {GenericAction} from '@sycadApp/libs/model-table';
import { AdvancedRemoteAutocomplete } from '../advanced-remote-autocomplete';

@Component({
  selector: 'app-autocomplete-sycad-table',
  templateUrl: './autocomplete-sycad-table.component.html',
  styleUrls: ['./autocomplete-sycad-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AutocompleteSycadTableComponent implements OnInit, OnDestroy {
 /* @Input('dataSourceProvider')
  backendApiService: {
    autocompletion(search: string): Observable<HttpResponse<any[]>>;
    searchName: string;
  };*/

  public contextTable: any;

  private _onDestroy = new Subject<void>();

  public dataSource: MatTableDataSource<any>;

  public isLoadingResults = true;
  public isRateLimitReached = false;


  public globalsearchTermSubject: Subject<string> = new Subject<string>();
  public colonneSearchTermSubject: Subject<string> = new Subject<string>();

  selected: any;
  public actions: GenericAction[] = [];

  public AnnulerModal() {
    this.matDialog.closeAll();
  }

  public SelectItem() {
    let action ;
    if (this.dataForm.customNgSelectConfig.multiple) {
      action = this.selectionColonne.selected;
    } else {
      action = this.selected;
    }
    if (action) {

      this.dialogRef.close(action);
    } else {
      this._snackBar.open('Vous devez selectionner un item ', 'Ok', {
        duration: 4000
      });
    }
  }

  constructor( private mediaObserver: MediaObserver, private router: Router, private route: ActivatedRoute, private _snackBar: MatSnackBar, public matDialog: MatDialog,
               public dialogRef: MatDialogRef<AutocompleteSycadTableComponent>,
               @Inject(MAT_DIALOG_DATA) public dataForm: AdvancedRemoteAutocomplete<any>) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
  //  this.backendApiService = this.dataForm.customNgSelectConfig.type;
    this.getListColonnePivot();

    merge(this.colonneSearchTermSubject, this.globalsearchTermSubject).pipe(
      takeUntil(this._onDestroy),
      debounceTime(750),
      startWith({}),
      filter( data => {
        let fcol=false;
        for (let i = 0; i < this.dataForm.tableDescription.colonnes.length; i++) {
          let colonne = this.dataForm.tableDescription.colonnes[i];
          fcol = (colonne.filterValue && colonne.filterValue.toString().length > 2) ? true : false;
          if(fcol) break ;
        }
        if(this.dataForm.tableDescription.globalFilter.length <= 2 && this.dataForm.tableDescription.globalFilter.length !== 0 && fcol === false) {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          return false;
        }
        return true;

      }),
      switchMap(() => {

      this.isLoadingResults = true;
      this.contextTable = this.dataForm.tableDescription.globalFilter;
      return this.dataForm.customNgSelectConfig.callbackAutocomplete(this.contextTable,null)
     /* return this.backendApiService.autocompletion(this.contextTable).pipe(
        map(context => {
          return context.body;
        }),
        catchError((err) => {
          return observableOf([]);
        })
      ); */
    }),
    ).subscribe(reponse => {

      let data = reponse.map((value) => this.dataForm.mapFunction(value));
      this.isLoadingResults = false;
      this.isRateLimitReached = false;
      if (this.dataForm.customNgSelectConfig.multiple) {
        if (this.selectionColonne.selected.length > 0) {
          this.dataForm.listItemSelected = this.selectionColonne.selected;
          data = this.selectionColonne.selected.concat(data);
          data = this.getUnique(data, this.dataForm.keyId);
        }
      }



      if (!this.dataForm.customNgSelectConfig.multiple) {
        if (this.dataForm.itemSelected) {
          this.selected = this.dataForm.itemSelected;
        }
        if (this.selected) {
          data.unshift(this.selected);
          data = this.getUnique(data, this.dataForm.keyId);
        }
      }
      this.dataSource.data = data;
    });
  }

  public getListColonnePivot() {
    let list= this.dataForm.tableDescription.colonnes.filter(el => el.show).map(el => el.name);
    return list;
  }

  getUnique(arr, comp) {
    const unique = arr
      .map(e => e[comp])

      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the dead keys & store unique objects
      .filter(e => arr[e])
      .map(e => arr[e]);

    return unique;
  }

  clearGlobalFilter(){
    this.globalsearchTermSubject.next('');
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.globalsearchTermSubject.next(filterValue);
  }

  public selectionColonne = new SelectionModel<any>(true, this.dataForm.listItemSelected);
  isAllSelected() {
    if (!this.dataSource) return ;
    const numSelected = this.selectionColonne.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionColonne.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  selectItem(item) {
    this.selected = item;
    this.dataForm.itemSelected = this.selected;
  }

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top'

    });
  }

}
