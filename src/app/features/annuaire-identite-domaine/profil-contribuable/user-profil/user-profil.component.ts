import { OnInit, ViewChild, ViewEncapsulation } from "@angular/core";

import {
  Compiler,
  Component,
  ComponentFactory,
  Injector,
  NgModuleFactory,
  ViewContainerRef,
} from "@angular/core";
import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';
import { Observable, of, BehaviorSubject } from "rxjs";

import { MatBottomSheet, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatDialog } from "@angular/material/dialog";
import { UserProfilService } from '@sycadApp/services/data-references/system/user-profil.service';

import { MatSnackBar } from "@angular/material/snack-bar";
import { ModificationInformationProfile } from "./modification-information-profile/modification-information-profile.component";
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { AuthentificatedUser, TypeUser } from '@sycadApp/features/transverse/login/auth.user';

@Component({
  selector: "app-user-profil",
  templateUrl: "./user-profil.component.html",
  styleUrls: ["./user-profil.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class UserProfilComponent implements OnInit {
  public typeUser: TypeUser;
  public userConnected$: Observable<AuthentificatedUser>;
  public toggleAvatarEdition = false;
  user: any;

  public activeMediaQuery = '';

  constructor(
    public authService: AuthenticationService,
    private _bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    public userProfilService: UserProfilService,
    private _snackBar: MatSnackBar,
    private mediaObserver: MediaObserver,
    private compiler: Compiler,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.authService.getMe().subscribe((ob) => {
      if (ob) {
        if (!this.typeUser) {
          this.typeUser = ob.typeUser;
          this.loadComponent(this.typeUser);
        }
        this.userConnected$ = of(ob);
        //this.userConnected$.subscribe(resp=>console.log(resp));
      }
    });
  }
  ngAfterContentInit() {
    
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
 //console.log("écran ",this.activeMediaQuery)

    });
  }
  finishAvatarUpdate(fileName): void {
    this.authService.updateAvatar(fileName);
    this.toggleAvatarEdition = !this.toggleAvatarEdition;
  }

  openBottomSheet(): void {
    let bottomSheet = this._bottomSheet.open(ModificationInformationProfile, {
      panelClass: "modification-information-profile-container",
    });

    bottomSheet.afterDismissed().subscribe((data) => {
     //// console.log("fermeture");
    });
  }

  @ViewChild("profilUserComponent", { read: ViewContainerRef })
  private anchor: ViewContainerRef;
  public componentFactories: ComponentFactory<any>[];
  public loadComponent(typeUser: string) {
    this.componentFactories = [];

   //// console.log("typeUser", typeUser);

    switch (typeUser) {
      case "AGENT":
        this.loadAGENTComponent();
        break;
      case "ACTEUR":
        this.loadACTEURComponent();
        break;
      case "CONTRIBUABLEPHYSIQUE":
        this.loadCONTRIBUABLEPHYSIQUEComponent();
        break;
      case "CONTRIBUABLEMORAL":
        this.loadCONTRIBUABLEMORALComponent();
        break;
      default:
        break;
    }
    /*  const { UserProfilAgentComponent,UserProfilAgentModule } = await import('@sycadApp/features/user-profil-agent/user-profil-agent.component');
    const moduleFactory = UserProfilAgentModule instanceof NgModuleFactory ? UserProfilAgentModule
      : (await this.compiler.compileModuleAsync(UserProfilAgentModule));
    const moduleRef = moduleFactory.create(this.injector);
    const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(UserProfilAgentComponent);
    this.anchor.clear();
    const profileComponent = this.anchor.createComponent(componentFactory);
    */
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
    const profileComponent = this.anchor.createComponent(componentFactory);
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
    const profileComponent = this.anchor.createComponent(componentFactory);
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
    const profileComponent = this.anchor.createComponent(componentFactory);
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
    const profileComponent = this.anchor.createComponent(componentFactory);
  }
}
