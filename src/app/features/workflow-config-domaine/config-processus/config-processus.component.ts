import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Processus } from "@sycadApp/models/workflow/common/general";
import { environment } from "environments/environment";

@Component({
  selector: 'app-cp-affectation',
  templateUrl: './config-processus.component.html',
  styleUrls: ['./config-processus.component.scss']
})
export class ConfigProcessusComponent implements OnInit {
  public processus: Processus;
  constructor(private _snackBar: MatSnackBar,
              private router: Router, public route: ActivatedRoute)
  {
    this.processus = this.route.snapshot.data['processus'];
  }

  ngOnInit(): void {

    }

  public getFrontendTemplate(){
    return ([`${environment.FRONTEND_ROUTES.CONFIGURATION_WORKFLOW}/edition`]);
  }
}
