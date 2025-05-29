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

import {AgentsService} from '@sycadApp/services/data-references/contribuables/agent.service';
import { ActivatedRoute } from "@angular/router";
import { AgentElement } from "@sycadApp/models/data-references/contribuables/agent.model";

@Component({
  selector: "app-agent-profil",
  templateUrl: "./agent-profil.component.html",
  styleUrls: ["./agent-profil.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AgentProfilComponent implements OnInit {
  public userCurrent$: Observable<AgentElement>;
  user: any;
  guid: string;

  constructor(
    public authService: AuthenticationService,
    public dialog: MatDialog,
    public userProfilService: UserProfilService,
    private compiler: Compiler,
    private injector: Injector,
    private agentService: AgentsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.guid = this.route.snapshot.params["guid"];
    this.agentService.get(this.guid).subscribe((agent) => {
      if (agent) {
        this.loadComponent();
        this.userCurrent$ = of(agent);
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
