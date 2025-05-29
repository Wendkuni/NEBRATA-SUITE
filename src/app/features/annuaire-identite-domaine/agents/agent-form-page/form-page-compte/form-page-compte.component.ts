import {Component, ViewEncapsulation} from '@angular/core';
import {
  FormBuilder, FormGroup, Validators
} from "@angular/forms";
import {
  AgentElement
} from "@sycadApp/models/data-references/contribuables/agent.model";
import {of, Subject} from "rxjs";
import {
  RemoteAutocomplete
} from "@sycadShared/form-components/model/remote-autocomplete";
import {
  StructureAutocomplete
} from "@sycadApp/models/data-references/organigramme/structure.model";
import {
  ServiceAutocomplete
} from "@sycadApp/models/data-references/organigramme/service.model";
import {
  BureauAutocomplete
} from "@sycadApp/models/data-references/organigramme/bureau.model";
import {
  MediaChange, MediaObserver
} from "@angular/flex-layout";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  AgentsService
} from "@sycadApp/services/data-references/contribuables/agent.service";
import {
  TitreHonorifiqueService
} from "@sycadApp/services/data-references/system/titreHonorifique.service";
import {
  StructureService
} from "@sycadApp/services/data-references/organigramme/structure.service";
import {
  ServiceAdministratifService
} from "@sycadApp/services/data-references/organigramme/ServiceAdministratif.service";
import {
  BureauService
} from "@sycadApp/services/data-references/organigramme/bureau.service";
import {
  AffecationMinimumExist, getErrors, MustMatch
} from "@sycadShared/validators/global-pattern";
import {takeUntil} from "rxjs/operators";
import {
  environment
} from "../../../../../../environments/environment";
import {SycadUtils} from "@sycadShared/utils.functions";
import {
  AttributsExist
} from "@sycadShared/validators/remote/attributs-exist";
import {
  ContactContribuableService
} from "@sycadApp/services/data-references/system/contact.service";
import {
  ProfilAutocomplete
} from "@sycadApp/models/data-references/security/profil.model";
import {
  RoleAutocomplete
} from "@sycadApp/models/data-references/security/role.model";
import {
  ProfilesService
} from "@sycadApp/services/data-references/security/profiles.service";
import {
  RolesService
} from "@sycadApp/services/data-references/security/roles-services";

@Component({
  selector: 'app-form-page-compte',
  templateUrl: './form-page-compte.component.html',
  styleUrls: ['./form-page-compte.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormPageCompteComponent {

  public formulaire: FormGroup;
  public formErrors: Array<string>;

  public agent: AgentElement;

  private _onDestroy = new Subject<void>();


  public profileRemoteAutocomplete = new RemoteAutocomplete<ProfilAutocomplete>();
  public roleRemoteAutocomplete = new RemoteAutocomplete<RoleAutocomplete>();
  public structureRemoteAutocomplete = new RemoteAutocomplete<StructureAutocomplete>();
  public serviceRemoteAutocomplete = new RemoteAutocomplete<ServiceAutocomplete>();
  public bureauRemoteAutocomplete = new RemoteAutocomplete<BureauAutocomplete>();

  public isLoadingResults = false;
  public activeMediaQuery = '';

  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private mediaObserver: MediaObserver,
              private _snackBar: MatSnackBar,

              public agentService: AgentsService,
              public contactContribuableService: ContactContribuableService,
              public profilsService: ProfilesService,
              public rolesService: RolesService,
              public structureService: StructureService,
              public serviceAdminService: ServiceAdministratifService,
              public bureauService: BureauService,) {

    this.agent = this.route.snapshot.data["agent"];
  }

  ngOnInit(): void {
    this.initFormulaire();
    this.initRemoteAutoComplete();
    this.patchFormulaire();
  }

  initFormulaire() {
    this.formulaire = this.formBuilder.group({
      guid: [null],
      active: [null || false],
      username: [null, null, [AttributsExist.validateUsernameExistFn(this.contactContribuableService)]],
      password: [null, Validators.compose([])],
      passwordc: [null, Validators.compose([])],
      resetOtp: [null || false],
      profils: [null],
      roles: [null],
      affectation: this.formBuilder.group({
        bureau: [null], service: [null], structure: [null]
      }, {
        validator: AffecationMinimumExist()
      }),
    }, {
      validator: MustMatch('password', 'passwordc')
    });

    this.formulaire.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.formErrors = getErrors(this.formulaire);
    });
  }

  patchFormulaire() {
    if (this.agent) {
      this.formulaire.patchValue({
        guid: this.agent.guid,
        active: this.agent.active,
        username: this.agent.username,
        profils:this.agent.profils.map(profil => profil.id),
        roles: this.agent.roles.map(role => role.id),
        affectation: {
          bureau: this.agent.affectation?.bureau?.id,
          service: this.agent.affectation?.service?.id,
          structure: this.agent.affectation?.structure?.id,
        }
      });
    }
  }

  initRemoteAutoComplete(){

    this.profileRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.profilsService);
    this.profileRemoteAutocomplete.params.set("type","AGENT");
    this.roleRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.rolesService);
    this.roleRemoteAutocomplete.params.set("type","ADMINISTRATION");

    if (this.agent) {
      if(this.agent?.profils) {
        this.profileRemoteAutocomplete.listRessource$=of(this.agent.profils);
        this.profileRemoteAutocomplete.initialList=this.agent.profils;
      }
      if(this.agent?.roles) {
        this.roleRemoteAutocomplete.listRessource$=of(this.agent.roles);
        this.roleRemoteAutocomplete.initialList=this.agent.roles;
      }

    }

  }

  public onSearchProfile(eventNgSelect){
    this.profileRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchRole(eventNgSelect){
    this.roleRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000, verticalPosition: "top",
    });
  }

  resetForm() {
    if (this.agent.guid) {
      this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_AGENT}`]);
    } else {
      this.formulaire.reset();
    }
  }

  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    } else {
      if (this.formulaire.value) {
        this.isLoadingResults = true;
        if (this.formulaire.value.guid) {
          this.agentService.update(this.formulaire.value).subscribe(data => {
            this.isLoadingResults = false;
            this.openSnackBar("Contribuable agent modifiée avec succès", "OK");
            this.router.navigate([environment.FRONTEND_ROUTES.CONTRIBUABLE_AGENT]);
          }, errorResponse => {
            this.isLoadingResults = false;
            SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
          });

        } else {
          // this.openSnackBar("Contribuable agent ajoutée avec succès","OK");
          this.router.navigate([environment.FRONTEND_ROUTES.CONTRIBUABLE_AGENT]);
        }
      }
    }


  }

}
