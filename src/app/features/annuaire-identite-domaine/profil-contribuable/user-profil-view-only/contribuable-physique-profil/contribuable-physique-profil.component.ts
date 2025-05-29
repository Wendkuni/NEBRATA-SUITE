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
import { ContribuablePhysiqueElement } from "@sycadApp/models/data-references/contribuables/contribuable-physique.model";
import {ContribuablePhysiqueService} from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';

@Component({
  selector: "app-contribuable-physique-profil",
  templateUrl: "./contribuable-physique-profil.component.html",
  styleUrls: ["./contribuable-physique-profil.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ContribuablePhysiqueProfilComponent implements OnInit {
  public userCurrent$: Observable<ContribuablePhysiqueElement>;
  user: any;
  guid: string;

  constructor(
    public authService: AuthenticationService,
    public dialog: MatDialog,
    public userProfilService: UserProfilService,
    private compiler: Compiler,
    private injector: Injector,
    private contribuablePhysiqueService: ContribuablePhysiqueService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.guid = this.route.snapshot.params["guid"];
    this.contribuablePhysiqueService.get(this.guid).subscribe((contribuable) => {
      if (contribuable) {
        this.loadComponent();
        this.userCurrent$ = of(contribuable);
      }
    });
  }

  @ViewChild("profilUserComponent", { read: ViewContainerRef })
  private anchor: ViewContainerRef;
  public loadComponent() {
    this.loadCONTRIBUABLEPHYSIQUEComponent();
  }

  async loadCONTRIBUABLEPHYSIQUEComponent() {
    const {
      UserProfilContribuablePhysiqueComponent,
      UserProfilContribuablePhysiqueModule,
    } = await import(
      "@sycadApp/features/annuaire-identite-domaine/profil-contribuable/user-profil-contribuable-physique/user-profil-contribuable-physique.component"
    );
    const moduleFactory =
      UserProfilContribuablePhysiqueModule instanceof NgModuleFactory
        ? UserProfilContribuablePhysiqueModule
        : await this.compiler.compileModuleAsync(UserProfilContribuablePhysiqueModule);
    const moduleRef = moduleFactory.create(this.injector);
    const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(
      UserProfilContribuablePhysiqueComponent
    );
    this.anchor.clear();
    this.anchor.createComponent(componentFactory);
  }
}
