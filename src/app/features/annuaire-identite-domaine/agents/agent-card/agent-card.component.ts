import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from "@angular/core";

import { TypeContact } from "@sycadApp/models/data-references/system/model";
import { AppConfirmService } from "@sycadApp/shared/app-confirm/app-confirm.service";

import { Router } from "@angular/router";
import { environment } from 'environments/environment';
import {AgentElement} from "@sycadApp/models/data-references/contribuables/agent.model";


@Component({
  selector: "app-agent-card",
  templateUrl: "./agent-card.component.html",
  styleUrls: ["./agent-card.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AgentCardComponent implements OnInit {
  @Input("agent")
  public agent: AgentElement;

  @Input("type")
  public type: string;

  @Output("delete")
  public delete: EventEmitter<AgentElement> = new EventEmitter<AgentElement>();

  public typeMail: TypeContact = TypeContact.EMAIL;
  public typePhone: TypeContact = TypeContact.TELEPONE;
  constructor(public confirmService: AppConfirmService, private router: Router) {

  }

  ngOnInit() {}

  public onEdition(agent: AgentElement) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_AGENT}/edition`, agent.guid]);
  }
  public onDelete(agent: AgentElement) {
    this.confirmService
      .confirm({
        title: "Confirmation",
        message: `Voulez-vous faire la suppression de cet agent ? `,
      })
      .subscribe(($choix) => {
        if ($choix === true) {
          this.delete.emit(agent);
        }
      });
  }

  public onViewProfil(guid: string) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_VIEW_PROFIL_AGENT}`, guid]);
  }

  public onAffectation(agent: AgentElement) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_AGENT}/affectation`, agent.guid]);
  }

  onGererCompte(agent: AgentElement) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_AGENT}/compte`, agent.guid]);
  }
}
