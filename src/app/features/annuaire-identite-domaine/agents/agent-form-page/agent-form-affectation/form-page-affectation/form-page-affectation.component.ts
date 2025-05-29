import {
  Component, OnInit, ViewEncapsulation
} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {
  AgentElement
} from "@sycadApp/models/data-references/contribuables/agent.model";
import {ActivatedRoute, Router} from "@angular/router";
import {
  AffecationMinimumExist, getErrors
} from "@sycadShared/validators/global-pattern";
import {
  RemoteAutocomplete
} from "@sycadShared/form-components/model/remote-autocomplete";
import {
  MediaChange, MediaObserver
} from "@angular/flex-layout";
import {takeUntil} from "rxjs/operators";
import {
  StructureAutocomplete
} from "@sycadApp/models/data-references/organigramme/structure.model";
import {
  StructureService
} from "@sycadApp/services/data-references/organigramme/structure.service";
import {
  ServiceAutocomplete
} from "@sycadApp/models/data-references/organigramme/service.model";
import {
  ServiceAdministratifService
} from "@sycadApp/services/data-references/organigramme/ServiceAdministratif.service";
import {
  BureauAutocomplete
} from "@sycadApp/models/data-references/organigramme/bureau.model";
import {
  BureauService
} from "@sycadApp/services/data-references/organigramme/bureau.service";
import {
  environment
} from "../../../../../../../environments/environment";
import {SycadUtils} from "@sycadShared/utils.functions";
import {
  AgentsService
} from "@sycadApp/services/data-references/contribuables/agent.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  MatSlideToggleChange
} from "@angular/material/slide-toggle";
import {of, Subject} from "rxjs";

@Component({
  selector: 'app-form-page-affectation',
  templateUrl: './form-page-affectation.component.html',
  styleUrls: ['./form-page-affectation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormPageAffectationComponent implements OnInit {

  public formulaire: FormGroup;
  public formErrors: Array<string>;

  public agent: AgentElement;

  private _onDestroy = new Subject<void>();
  public structureRemoteAutocomplete = new RemoteAutocomplete<StructureAutocomplete>();
  public serviceRemoteAutocomplete = new RemoteAutocomplete<ServiceAutocomplete>();
  public bureauRemoteAutocomplete = new RemoteAutocomplete<BureauAutocomplete>();

  public isLoadingResults = false;
  public activeMediaQuery = '';

  get structure() {
    return this.formulaire.get('affectation').get('structure');
  }

  get service() {
    return this.formulaire.get('affectation').get('service');
  }

  get bureau() {
    return this.formulaire.get('affectation').get('bureau');
  }

  get signataire() {
    return this.formulaire.get('signataire');
  }

  get interim() {
    return this.formulaire.get('interim');
  }


  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private mediaObserver: MediaObserver, private _snackBar: MatSnackBar, public agentService: AgentsService, public structureService: StructureService, public serviceAdminService: ServiceAdministratifService, public bureauService: BureauService,) {

    this.agent = this.route.snapshot.data["agent"];
    this.initFormulaire();
  }

  ngOnInit(): void {
    this.initRemoteAutoComplete();
    this.patchFormulaire();
  }

  initFormulaire() {
    this.formulaire = this.formBuilder.group({
      guid: [null],
      active: [null || false],
      fonction: [null],
      affectation: this.formBuilder.group({
        bureau: [null],
        service: [null],
        structure: [null],
        signataire: [null || false],
        interim: [null || false]
      }, {
        validator: AffecationMinimumExist()
      }),
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
        fonction: this.agent.fonction,
        affectation: {
          bureau: this.agent.affectation?.bureau?.id,
          service: this.agent.affectation?.service?.id,
          structure: this.agent.affectation?.structure?.id,
          signataire: this.agent.affectation?.signataire,
          interim: this.agent.affectation?.interim,
        }
      });
    }
  }

  initRemoteAutoComplete() {
    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.structureService);
    this.serviceRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.serviceAdminService);
    this.bureauRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.bureauService);

    if (this.agent) {
      if (this.agent.affectation?.structure) {
        this.structureRemoteAutocomplete.listRessource$ = of([this.agent.affectation.structure]);
        this.structureRemoteAutocomplete.initialList = [this.agent.affectation.structure];
        this.serviceRemoteAutocomplete.params.set("structure", this.agent.affectation.structure.code);
        this.bureauRemoteAutocomplete.params.set("structure", this.agent.affectation.structure.code);
      }

      if (this.agent.affectation?.service) {
        this.serviceRemoteAutocomplete.listRessource$ = of([this.agent.affectation.service]);
        this.serviceRemoteAutocomplete.initialList = [this.agent.affectation.service];
        this.bureauRemoteAutocomplete.params.set("service", this.agent.affectation.service.code);
      }

      if (this.agent.affectation?.bureau) {
        this.bureauRemoteAutocomplete.listRessource$ = of([this.agent.affectation.bureau]);
        this.bureauRemoteAutocomplete.initialList = [this.agent.affectation.bureau];
      }

    }

  }


  public onChangeSignataire(event: MatSlideToggleChange) {
    if (!event.checked) {
      this.formulaire.patchValue({
        affectation: {
          interim: false,
        }
      });
    }
  }

  public onChangeInterim(event: MatSlideToggleChange) {
    if (event.checked) {
      this.formulaire.patchValue({
        affectation: {
          signataire: true,
        }
      });
    }
  }

  public onChangeStructure(structure: StructureAutocomplete) {
    this.serviceRemoteAutocomplete.resetParams();
    this.serviceRemoteAutocomplete.initialList = [];
    this.service.reset();

    this.bureauRemoteAutocomplete.resetParams();
    this.bureauRemoteAutocomplete.initialList = [];
    this.bureau.reset();

    if (structure) {
      this.serviceRemoteAutocomplete.params.set("structure", structure.code);
      this.serviceRemoteAutocomplete.term.next("");

      this.bureauRemoteAutocomplete.params.set("structure", structure.code);
      this.bureauRemoteAutocomplete.term.next("");
    }


  }

  public onSearchStructure(eventNgSelect) {
    this.structureRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onChangeService(service: ServiceAutocomplete) {
    this.bureauRemoteAutocomplete.resetParams();
    this.bureauRemoteAutocomplete.initialList = [];
    this.bureau.reset();

    if (service) {
      this.bureauRemoteAutocomplete.params.set("service", service.code);
      this.bureauRemoteAutocomplete.term.next("");
    }

  }

  public onSearchService(eventNgSelect) {
    this.serviceRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchBureau(eventNgSelect) {
    this.bureauRemoteAutocomplete.term.next(eventNgSelect.term);
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
      console.log(this.formulaire.value)
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
