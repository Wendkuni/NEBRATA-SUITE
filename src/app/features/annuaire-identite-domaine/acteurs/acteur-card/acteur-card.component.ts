import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { ActeurElement } from "@sycadApp/models/data-references/contribuables/acteur.model";
import { AppConfirmService } from "@sycadShared/app-confirm/app-confirm.service";
import { Router } from "@angular/router";
import { environment } from 'environments/environment';


@Component({
  selector: "app-acteur-card",
  templateUrl: "./acteur-card.component.html",
  styleUrls: ["./acteur-card.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ActeurCardComponent implements OnInit {
  @Input("acteur")
  public acteur: ActeurElement;

  @Input("type")
  public type: string;

  @Output("delete")
  public delete: EventEmitter<ActeurElement> = new EventEmitter<ActeurElement>();
  constructor(public confirmService: AppConfirmService, private router: Router) {}
  ngOnInit(): void {}
  public onEdition(acteur: ActeurElement) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_ACTEUR}/edition`, acteur.guid]);
}
  public onDelete(acteur: ActeurElement) {
    this.confirmService
      .confirm({
        title: "Confirmation",
        message: `Voulez-vous faire la suppression de l'acteur ? `,
      })
      .subscribe(($choix) => {
        if ($choix === true) {
          this.delete.emit(acteur);
        }
      });
  }

  public onViewProfil(guid: string) {
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_VIEW_PROFIL_ACTEUR}`, guid]);
  }
}
