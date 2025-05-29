import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GlobalPattern, AffecationMinimumExist} from '@sycadShared/validators/global-pattern';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {Router} from '@angular/router';
import { CompteService } from '@sycadApp/services/data-references/contribuables/compte.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-create-compte',
  templateUrl: './create-compte.component.html',
  styleUrls: ['./create-compte.component.scss']
})
export class CreateCompteComponent implements OnInit {
    public typeDeCompte;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  public onChoixTypeCompte() {
    if(this.typeDeCompte){
      //console.log("typeDeCompte",this.typeDeCompte);

      switch (this.typeDeCompte) {
     /*   case "AGENT":
          this.router.navigate([`${environment.FRONTEND_ROUTES.SYSTEM_CREER_COMPTE}/type-compte/AGENT`]);
          break; */
        case "CONTRIBUABLEMORALE":
          this.router.navigate([`${environment.FRONTEND_ROUTES.SYSTEM_CREER_COMPTE}/type-compte/CONTRIBUABLEMORALE`]);
          break;
          case "CONTRIBUABLEPHYSIQUE":
            this.router.navigate([`${environment.FRONTEND_ROUTES.SYSTEM_CREER_COMPTE}/type-compte/CONTRIBUABLEPHYSIQUE`]);
          break;
       /*   case "ACTEUR":
            this.router.navigate([`${environment.FRONTEND_ROUTES.SYSTEM_CREER_COMPTE}/type-compte/ACTEUR`]); */
          break;
      }

    }
    this.typeDeCompte=null;
   }



}
