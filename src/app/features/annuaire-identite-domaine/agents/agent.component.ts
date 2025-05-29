import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Settings } from '@sycadApp/config/app.settings.model';
import { Subject, merge} from 'rxjs';
import { AppSettingsService } from '@sycadApp/config/app.settings.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SycadTableContext } from '@sycadApp/libs/model-table';
import { debounceTime, switchMap, takeUntil, startWith } from 'rxjs/operators';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from 'environments/environment';

import {AgentItem} from "@sycadApp/models/data-references/contribuables/agent.model";
import {AgentsService} from '@sycadApp/services/data-references/contribuables/agent.service';



@Component({
  selector: "app-agent",
  templateUrl: "./agent.component.html",
  styleUrls: ["./agent.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AgentComponent  implements OnInit {


  public settings: Settings;
  public context = new SycadTableContext<AgentItem>();
  public globalsearchTermSubject: Subject<string> = new Subject<string>();


  @ViewChild(MatPaginator, { static: true })
  public paginator: MatPaginator;

  constructor(
    public appSettings: AppSettingsService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public agentService: AgentsService) {
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

          return this.agentService.search(this.context);
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
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_AGENT}/edition`]);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: 'top'

    });
  }
  public supprimer(data) {


    this.agentService.delete(data.guid).subscribe(
      data => {
        this.openSnackBar("Contribuable agent supprimé avec succès","OK");
        this.globalsearchTermSubject.next("");
      },
      errorResponse => {
        this.openSnackBar("Impossible de supprimer le contribuable agent","OK");
      }
    );
  }
}
