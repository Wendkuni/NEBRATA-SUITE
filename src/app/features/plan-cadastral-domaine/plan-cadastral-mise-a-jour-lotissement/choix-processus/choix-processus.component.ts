import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-choix-processus',
  templateUrl: './choix-processus.component.html',
  styleUrls: ['./choix-processus.component.scss']

})
export class ChoixProcessusComponent implements OnInit {



  constructor(private router: Router, public dialogRef: MatDialogRef<ChoixProcessusComponent>,) {}


  ngOnInit(): void {

  }

  public routeVersLive(){
    this.dialogRef.close();
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MAJ_PLAN_CADASTRE}/edition`]);
  }

  public routeVersSaisieDifferee(){
    this.dialogRef.close();
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_MAJ}/edition`]);
  }
}
