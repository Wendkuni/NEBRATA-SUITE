import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from "@angular/core";


import { AppConfirmService } from "@sycadApp/shared/app-confirm/app-confirm.service";

import { ContribuableElement } from "@sycadApp/models/data-references/contribuables/global.model";
import { ContribuableMoraleElement } from "@sycadApp/models/data-references/contribuables/contribuable-moral.model";
import { Router } from "@angular/router";
import { environment } from 'environments/environment';
import { TypeContact } from '@sycadApp/models/data-references/system/model';

@Component({
  selector: "app-contribuable-moral-card",
  templateUrl: "./contribuale-moral-card.component.html",
  styleUrls: ["./contribuale-moral-card.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ContribuableMoralCardComponent implements OnInit {
  @Input("contribuable")
  public contribuable: ContribuableMoraleElement;

  @Input("type")
  public type: string;
  @Output("delete")
  public delete: EventEmitter<ContribuableElement> = new EventEmitter<ContribuableElement>();

  public typeMail: TypeContact = TypeContact.EMAIL;
  public typePhone: TypeContact = TypeContact.TELEPONE;
  constructor(public confirmService: AppConfirmService, private router: Router) {}

  ngOnInit() {}

  public onEdition(contribuable: ContribuableElement) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_MORAL}/edition`, contribuable.guid]);
  }
  public onDelete(contribuable: ContribuableElement) {
   this.confirmService
      .confirm({
        title: "Confirmation",
        message: `Voulez-vous supprimer ce contribuble moral ? `,
      })
      .subscribe(($choix) => {
        if ($choix === true) {
          this.delete.emit(contribuable);
        }
      });
  }

  public onViewProfil(guid: string) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_VIEW_PROFIL_MORAL}`, guid]);
  }
}
