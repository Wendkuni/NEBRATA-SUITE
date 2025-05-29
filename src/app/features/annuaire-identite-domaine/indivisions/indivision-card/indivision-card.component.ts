import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from "@angular/core";

import { TypeContact } from "@sycadApp/models/data-references/system/model";
import { AppConfirmService } from "@sycadApp/shared/app-confirm/app-confirm.service";

import { Router } from "@angular/router";
import { IndivisionElement } from '@sycadApp/models/data-references/contribuables/indivisions.model';
import { environment } from 'environments/environment';


@Component({
  selector: "app-indivision-card",
  templateUrl: "./indivision-card.component.html",
  styleUrls: ["./indivision-card.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class IndivisionCardComponent implements OnInit {
  @Input("contribuable")
  public contribuable: IndivisionElement;

  @Input("type")
  public type: string;

  @Output("delete")
  public delete: EventEmitter<IndivisionElement> = new EventEmitter<IndivisionElement>();


  public typeMail: TypeContact = TypeContact.EMAIL;
  public typePhone: TypeContact = TypeContact.TELEPONE;
  constructor(public confirmService: AppConfirmService, private router: Router) {

  }

  ngOnInit() {}

  public onEdition(indivision: IndivisionElement) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_INDIVISION}/edition`, indivision.guid]);
  }
  public onDelete(indivision: IndivisionElement) {
    this.confirmService
      .confirm({
        title: "Confirmation",
        message: `Voulez-vous faire la suppression de cette indivision ?`,
      })
      .subscribe(($choix) => {
        if ($choix === true) {
          this.delete.emit(indivision);
        }
      });
  }

  public onViewProfil(guid: string) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_VIEW_PROFIL_INDIVISION}`, guid]);
  }
}
