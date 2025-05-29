import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {MatTabGroup} from "@angular/material/tabs";
import { AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';
import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';
import {
  ParcelleElement,
  ParcelleInexistante
} from "@sycadApp/models/data-references/territoire/localite.model";
import {Subject} from "rxjs";

@Component({
  selector: 'app-entites-cadastrales',
  templateUrl: './entites-cadastrales.component.html',
  styleUrls: ['./entites-cadastrales.component.scss']
})
export class EntitesCadastralesComponent implements OnInit ,OnDestroy{
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  attribution: Attribution;
  public authentificatedUser: AuthentificatedUser;

  private _onDestroy = new Subject<void>();
  constructor(public authService: AuthenticationService) { }

  ngOnInit(): void {
    this.authService.getMe().subscribe((ob) => {
      this.authentificatedUser=ob;
       });
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  onNavigateToDetails(parcelle:any) {
    this.attribution = {
      parcelleInexistante: null,
      parcelle: parcelle
    };
    this.tabGroup.selectedIndex = 1;  // Onglet Détails
  }
}

export interface Attribution{
  parcelleInexistante?: ParcelleInexistante;
  parcelle: ParcelleElement;
}
