import {Component, Input, OnInit} from '@angular/core';
import {
  TransitionSdMajPlanComponent
} from "@sycadFeature/plan-cadastral-domaine/saisie-differee-maj-plan/edition-maj-plan/transition-sd-maj-plan.component";
import {
  Document,
  Processus
} from "@sycadApp/models/workflow/common/general";
import {
  FormArray,
  FormBuilder,
  Validators
} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  AppConfirmService
} from "@sycadShared/app-confirm/app-confirm.service";
import {DateAdapter} from "@angular/material/core";
import {MediaObserver} from "@angular/flex-layout";
import {
  environment
} from "../../../../../../environments/environment";
import {SycadUtils} from "@sycadShared/utils.functions";
import {
  SdMajService
} from "@sycadApp/services/workflow/common/regularisation.service";
import {
  TransitionPlanCadastralComponent
} from "@sycadShared/form-components/processus/transition.plan-cadastral.component";
import {
  PlanCadastralRegularisationElement
} from "@sycadApp/models/workflow/regularisation.model";
@Component({
  selector: 'app-archiver-document',
  templateUrl: './archiver-document.component.html',
  styleUrls: ['./archiver-document.component.scss']
})
export class ArchiverDocumentComponent extends TransitionPlanCadastralComponent<PlanCadastralRegularisationElement> implements OnInit {
  @Input()
  public processus: Processus;
  get documents() { return this.formulaire.controls.documents as FormArray; }
  get pieceJointe() { return this.formulaire.get('document').get('pieceJointe'); }
  get libelle() { return this.formulaire.get('document').get('libelle'); }

  constructor(public router: Router,
              public _snackBar: MatSnackBar,
              public confirmService: AppConfirmService,
              public _adapter: DateAdapter<any>,
              public mediaObserver: MediaObserver,
              public fb: FormBuilder,
              public sdMajService: SdMajService) {
    super(router, _snackBar, confirmService, _adapter, mediaObserver, fb);

    this.formulaire = this.fb.group({
      numero: [null, [Validators.required]],
      action: [null, [Validators.required]],
      documents: new FormArray([]),

    });
  }

  ngOnInit(): void {

    this._adapter.setLocale("fr");
    this.formulaire.patchValue({
      numero: this.planCadastral.numero,
      action: this.transition.code
    });

    if (this.planCadastral.documents) {
      this.planCadastral.documents.map((document) => {
        this.documents.insert(0, this.createDocument(document));
      });
    }


  }


  createDocument(document: Document = null) {
    if (document != null) {
      return this.fb.group({
        id: [document.id],
        libelle: [document.libelle, [Validators.required]],
        numero: [document.numero, [Validators.required]],
        pieceJointe: [document.pieceJointe],
        dateValidite: [document.dateValidite],
        documentType: [document.documentType.id, [Validators.required]],
        dateDoc: [document.dateDoc, [Validators.required]]
      });
    } else {
      return this.fb.group({
        id: [null],
        libelle: [null, [Validators.required]],
        numero: [null, [Validators.required]],
        pieceJointe: [null, [Validators.required]],
        dateValidite: [null],
        documentType: [null, [Validators.required]],
        dateDoc: [null, [Validators.required]]
      });
    }
  }


  addDocument() {
    this.documents.insert(0, this.createDocument());

  }

  removeDocument(index) {

    this.documents.removeAt(index);

  }
  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }
    this.loadingEvent.emit(true);
    this.sdMajService.executer(this.formulaire.value).subscribe(data => {
        this.loadingEvent.emit(false);
        this.openSnackBar("Saisie maj plan cadastral archivé avec succès", "OK");
        this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MAJ_PLAN_CADASTRE]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }

  resetForm() {

    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MAJ_PLAN_CADASTRE}`]);
  }
}
