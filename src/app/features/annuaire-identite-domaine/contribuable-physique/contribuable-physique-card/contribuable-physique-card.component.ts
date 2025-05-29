import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from "@angular/core";

import { TypeContact } from "@sycadApp/models/data-references/system/model";
import { AppConfirmService } from "@sycadApp/shared/app-confirm/app-confirm.service";

import { Router } from "@angular/router";
import { environment } from 'environments/environment';
import {ContribuablePhysiqueElement} from "@sycadApp/models/data-references/contribuables/contribuable-physique.model";



@Component({
  selector: "app-contribuable-physique-card",
  templateUrl: "./contribuable-physique-card.component.html",
  styleUrls: ["./contribuable-physique-card.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ContribuablePhysiqueCardComponent implements OnInit {
  @Input("contribuable")
  public contribuable: ContribuablePhysiqueElement;

  @Input("type")
  public type: string;

  @Output("delete")
  public delete: EventEmitter<ContribuablePhysiqueElement> = new EventEmitter<ContribuablePhysiqueElement>();

  public typeMail: TypeContact = TypeContact.EMAIL;
  public typePhone: TypeContact = TypeContact.TELEPONE;
  constructor(public confirmService: AppConfirmService, private router: Router) {

  }

  ngOnInit() {}

  public onEdition(contribuable: ContribuablePhysiqueElement) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_PHYSIQUE}/edition`, contribuable.guid]);
  }
  public onDelete(contribuable: ContribuablePhysiqueElement) {
    this.confirmService
      .confirm({
        title: "Confirmation",
        message: `Voulez-vous faire la suppression du contribuable physique ? `,
      })
      .subscribe(($choix) => {
        if ($choix === true) {
          this.delete.emit(contribuable);
        }
      });
  }

  public onViewProfil(guid: string) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_VIEW_PROFIL_PHYSIQUE}`, guid]);
  }
}
