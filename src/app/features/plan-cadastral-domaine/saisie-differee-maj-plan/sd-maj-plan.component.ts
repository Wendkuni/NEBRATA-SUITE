import {
  Compiler,
  Component,
  Injector,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MediaObserver} from '@angular/flex-layout';
import {Router} from '@angular/router';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {MatDialog} from '@angular/material/dialog';


import { environment } from 'environments/environment';
import { SdMajService } from '@sycadApp/services/workflow/common/regularisation.service';

@Component({
  selector: 'app-regulation',
  templateUrl: './sd-maj-plan.component.html',
  styleUrls: ['./sd-maj-plan.component.scss']
})
export class SdMajPlanComponent  implements OnInit {

  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();
  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  constructor(private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver,
              private router: Router,
              public confirmService: AppConfirmService,
              public dialog: MatDialog,private compiler: Compiler,
              private injector: Injector, public sdMajService: SdMajService) {  }

  ngOnInit(): void {
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MAJ_PLAN_CADASTRE}`]);
  }

}
