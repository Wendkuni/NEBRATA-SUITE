import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Settings } from '@sycadApp/config/app.settings.model';
import { Subject, merge} from 'rxjs';
import { AppSettingsService } from '@sycadApp/config/app.settings.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SycadTableContext } from '@sycadApp/libs/model-table';
import { debounceTime, switchMap, takeUntil, startWith } from 'rxjs/operators';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IndivisionItem } from '@sycadApp/models/data-references/contribuables/indivisions.model';
import {IndivisionsService} from '@sycadApp/services/data-references/contribuables/indivisions.service';
import { environment } from 'environments/environment';



@Component({
  selector: "app-indivisions",
  templateUrl: "./indivisions.component.html",
  styleUrls: ["./indivisions.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class IndivisionsComponent  implements OnInit {


  public settings: Settings;
  public context = new SycadTableContext<IndivisionItem>();
  public globalsearchTermSubject: Subject<string> = new Subject<string>();


  @ViewChild(MatPaginator, { static: true })
  public paginator: MatPaginator;

  constructor(
    public appSettings: AppSettingsService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public indivisionService: IndivisionsService) {
    this.settings = this.appSettings.settings;
  }
  ngAfterViewInit() {


  }
  private _onDestroy = new Subject<void>();
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  ngOnInit() {

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

          return this.indivisionService.search(this.context);
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


  public ajout() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_INDIVISION}/edition`]);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: 'top'

    });
  }
/*
  public ajout() {
    this.openContribuableFormModal(null);
  }
  public modifier(contribuable) {
    this.contribuableService.get(contribuable.guid).subscribe(contribuableElement => {
        this.openContribuableFormModal(contribuableElement);
      },
      errorResponse => {
        this.openSnackBar("Impossible de récupérer le contribuable depuis le serveur","OK");
      })

  }
*/
  public supprimer(data) {


    this.indivisionService.delete(data.guid).subscribe(
      data => {
        this.openSnackBar("Contribuable indivision supprimé avec succès","OK");
        this.globalsearchTermSubject.next("");
      },
      errorResponse => {
        this.openSnackBar("Impossible de supprimer le contribuable indivision","OK");
      }
    );
  }
/*
  public openContribuableFormModal(contribuable) {
    let dialogRef = this.dialog.open(ContribuableMoralFormModalComponent, {
      data: contribuable,
      panelClass:"sycad-modal-form",
      position: {
        top:'2vw'
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(contribuable => {

      if(contribuable) {
        if (contribuable.guid) {
          this.openSnackBar("Edition contribuable réussie avec succès", "OK");

        }else {
          this.openSnackBar("Le contribuable a été ajouté avec succès", "OK");
        }
        this.globalsearchTermSubject.next("");
      }

    });
  }
*/
}
