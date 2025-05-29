import {
  Component,
  OnInit,
  Compiler,
  Injector,
  ViewContainerRef,
  NgModuleFactory,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable, of } from "rxjs";
import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';
import { UserProfilService } from '@sycadApp/services/data-references/system/user-profil.service';

import { ActivatedRoute } from "@angular/router";
import { AgentElement } from "@sycadApp/models/data-references/contribuables/agent.model";
import { ActeurElement } from "@sycadApp/models/data-references/contribuables/acteur.model";
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';


@Component({
  selector: "app-acteur-profil",
  templateUrl: "./acteur-profil.component.html",
  styleUrls: ["./acteur-profil.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ActeurProfilComponent implements OnInit {
  public userCurrent$: Observable<ActeurElement>;
  user: any;
  guid: string;

  constructor(
    public authService: AuthenticationService,
    public dialog: MatDialog,
    public userProfilService: UserProfilService,
    private compiler: Compiler,
    private injector: Injector,
    private acteurService: ActeursService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.guid = this.route.snapshot.params["guid"];
    this.acteurService.get(this.guid).subscribe((acteur) => {
      if (acteur) {
        this.loadComponent();
        this.userCurrent$ = of(acteur);
      }
    });
  }

  @ViewChild("profilUserComponent", { read: ViewContainerRef })
  private anchor: ViewContainerRef;
  public loadComponent() {
    this.loadACTEURComponent();
  }

  async loadACTEURComponent() {
    const { UserProfilActeurModule, UserProfilActeurComponent } = await import(
      "@sycadApp/features/annuaire-identite-domaine/profil-contribuable/user-profil-acteur/user-profil-acteur.component"
    );
    const moduleFactory =
      UserProfilActeurModule instanceof NgModuleFactory
        ? UserProfilActeurModule
        : await this.compiler.compileModuleAsync(UserProfilActeurModule);
    const moduleRef = moduleFactory.create(this.injector);
    const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(
      UserProfilActeurComponent
    );
    this.anchor.clear();
    this.anchor.createComponent(componentFactory);
  }
}
