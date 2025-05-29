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
import { ContribuableMoraleElement } from "@sycadApp/models/data-references/contribuables/contribuable-moral.model";
import {ContribuableMoralService} from '@sycadApp/services/data-references/contribuables/contribuable-moral-service';

@Component({
  selector: "app-contribuable-moral-profil",
  templateUrl: "./contribuable-moral-profil.component.html",
  styleUrls: ["./contribuable-moral-profil.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ContribuableMoralProfilComponent implements OnInit {
  public userCurrent$: Observable<ContribuableMoraleElement>;
  user: any;
  guid: string;

  constructor(
    public authService: AuthenticationService,
    public dialog: MatDialog,
    public userProfilService: UserProfilService,
    private compiler: Compiler,
    private injector: Injector,
    private contribuableMoralService: ContribuableMoralService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.guid = this.route.snapshot.params["guid"];
    this.contribuableMoralService.get(this.guid).subscribe((contribuable) => {
      if (contribuable) {
        this.loadComponent();
        this.userCurrent$ = of(contribuable);
      }
    });
  }

  @ViewChild("profilUserComponent", { read: ViewContainerRef })
  private anchor: ViewContainerRef;
  public loadComponent() {
    this.loadCONTRIBUABLEMORALComponent();
  }

  async loadCONTRIBUABLEMORALComponent() {
    const {
      UserProfilContribuableMoralModule,
      UserProfilContribuableMoralComponent,
    } = await import(
      "@sycadApp/features/annuaire-identite-domaine/profil-contribuable/user-profil-contribuable-moral/user-profil-contribuable-moral.component"
    );
    const moduleFactory =
      UserProfilContribuableMoralModule instanceof NgModuleFactory
        ? UserProfilContribuableMoralModule
        : await this.compiler.compileModuleAsync(UserProfilContribuableMoralModule);
    const moduleRef = moduleFactory.create(this.injector);
    const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(
      UserProfilContribuableMoralComponent
    );
    this.anchor.clear();
    this.anchor.createComponent(componentFactory);
  }
}
