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
import { IndivisionElement } from '@sycadApp/models/data-references/contribuables/indivisions.model';
import {IndivisionsService} from '@sycadApp/services/data-references/contribuables/indivisions.service';

@Component({
  selector: "app-indivision-profil",
  templateUrl: "./indivision-profil.component.html",
  styleUrls: ["./indivision-profil.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class IndivisionProfilComponent implements OnInit {
  public userCurrent$: Observable<IndivisionElement>;
  user: any;
  guid: string;

  constructor(
    public authService: AuthenticationService,
    public dialog: MatDialog,
    public userProfilService: UserProfilService,
    private compiler: Compiler,
    private injector: Injector,
    private indivisionService: IndivisionsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.guid = this.route.snapshot.params["guid"];
    this.indivisionService.get(this.guid).subscribe((indivision) => {
      if (indivision) {
        this.loadComponent();
        this.userCurrent$ = of(indivision);
      }
    });
  }

  @ViewChild("profilUserComponent", { read: ViewContainerRef })
  private anchor: ViewContainerRef;
  public loadComponent() {
    this.loadAGENTComponent();
  }

  async loadAGENTComponent() {
    const { UserProfilAgentComponent, UserProfilAgentModule } = await import(
      "@sycadApp/features/annuaire-identite-domaine/profil-contribuable/user-profil-agent/user-profil-agent.component"
    );
    const moduleFactory =
      UserProfilAgentModule instanceof NgModuleFactory
        ? UserProfilAgentModule
        : await this.compiler.compileModuleAsync(UserProfilAgentModule);
    const moduleRef = moduleFactory.create(this.injector);
    const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(
      UserProfilAgentComponent
    );
    this.anchor.clear();
    this.anchor.createComponent(componentFactory);
  }
}
