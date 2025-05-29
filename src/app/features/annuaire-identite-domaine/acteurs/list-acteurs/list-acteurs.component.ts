import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Settings} from '@sycadSetting/app.settings.model';
import {SycadTableContext} from '@sycadApp/libs/model-table';
import {ActeurItem} from '@sycadApp/models/data-references/contribuables/acteur.model';
import {merge, Subject} from 'rxjs';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {AppSettingsService} from '@sycadSetting/app.settings.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {debounceTime, startWith, switchMap, takeUntil} from 'rxjs/operators';

import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-list-acteurs',
  templateUrl: './list-acteurs.component.html',
  styleUrls: ['./list-acteurs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListActeursComponent implements OnInit {

  public settings: Settings;
  public context = new SycadTableContext<ActeurItem>();
  public globalsearchTermSubject: Subject<string> = new Subject<string>();

  @ViewChild(MatPaginator, { static: true })
  public paginator: MatPaginator;

  constructor(
    public appSettings: AppSettingsService,
    private router: Router,

    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public acteurService: ActeursService)
  { this.settings = this.appSettings.settings;}

  ngAfterViewInit() {

  }

  private _onDestroy = new Subject<void>();
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.paginator.pageIndex = (params.get("_page")) ? Number(params.get("_page")) : 0;
      this.paginator.pageSize = (params.get("_limit")) ? Number(params.get("_limit")) : 6;

    });


    merge(this.globalsearchTermSubject, this.paginator.page)
      .pipe(
        debounceTime(750),
        takeUntil(this._onDestroy),
        startWith({}),
        switchMap(() => {

          this.context.limit = this.paginator.pageSize;
          this.context.page = this.paginator.pageIndex;

          return this.acteurService.search(this.context);
        })).subscribe(data => {
      this.context.items = data.items;
      this.context.limit = data.limit;
      this.context.page = data.page;
      this.context.totalCount = data.totalCount;
    });
  }
  public onGlobalSearch() {
    this.globalsearchTermSubject.next(this.context.search);

  }
  public onPageEvent(pageEvent: PageEvent) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { _page: pageEvent.pageIndex, _limit: pageEvent.pageSize } });
    if (this.settings.preference.fixedHeader) {
      document.getElementById('main-content').scrollTop = 0;
    }
    else {
      document.getElementsByClassName('mat-drawer-content')[0].scrollTop = 0;
    }

  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: 'top'

    });
  }

  public ajout() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_ACTEUR}/edition`]);
  }

  public supprimer(data) {


    this.acteurService.delete(data.guid).subscribe(
      data => {
        this.openSnackBar("Acteur supprimé avec succès","OK");
        this.globalsearchTermSubject.next("");
      },
      errorResponse => {
        this.openSnackBar("Impossible de supprimer l'acteur","OK");
      }
    );
  }


}
