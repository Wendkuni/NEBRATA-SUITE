import {Component, Input, OnInit} from '@angular/core';
import {
  TransitionSdSectionnementComponent
} from "@sycadFeature/plan-cadastral-domaine/saisie-differee-sectionnement/edition-sectionnement/transition-sd-sectionnement.component";
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
  PlanCadastralSectionnementService
} from "@sycadApp/services/workflow/common/sectionnement-services";
import {
  BureauService
} from "@sycadApp/services/data-references/organigramme/bureau.service";
import {
  StructureService
} from "@sycadApp/services/data-references/organigramme/structure.service";
import {
  ServiceAdministratifService
} from "@sycadApp/services/data-references/organigramme/ServiceAdministratif.service";
import {
  CommunesService
} from "@sycadApp/services/data-references/territoire/communes.service";
import {
  DocumentTypeService
} from "@sycadApp/services/data-references/system/document-type.service";
import {MatDialog} from "@angular/material/dialog";
import {
  CategoriePieceService
} from "@sycadApp/services/data-references/system/categorie-piece.service";
import {
  SdSectionnementService
} from "@sycadApp/services/workflow/common/sd-sectionnement.service";
import {
  ContribuableService
} from "@sycadApp/services/data-references/system/contribuable.service";
import {
  ActeursService
} from "@sycadApp/services/data-references/contribuables/acteurs.service";
import {
  MandatService
} from "@sycadApp/services/workflow/mandat.service";
import {
  environment
} from "../../../../../../environments/environment";
import {SycadUtils} from "@sycadShared/utils.functions";

@Component({
  selector: 'app-archiver-document',
  templateUrl: './archiver-document.component.html',
  styleUrls: ['./archiver-document.component.scss']
})
export class ArchiverDocumentComponent extends TransitionSdSectionnementComponent implements OnInit {
  @Input()
  public processus: Processus;

  get documents() { return this.formulaire.controls.documents as FormArray; }
  constructor(public dialog: MatDialog,
              public router: Router,
              public _snackBar: MatSnackBar,
              public confirmService: AppConfirmService,
              public _adapter: DateAdapter<any>,
              public mediaObserver: MediaObserver,
              public fb: FormBuilder,
              public categoriePieceService: CategoriePieceService,
              public communeService: CommunesService,
              public sdSectionnementService: SdSectionnementService,
              public contribuableService: ContribuableService,
              public acteurService: ActeursService,
              public structureService: StructureService,
              public mandatService: MandatService,
              public bureauService : BureauService,
              public serviceAdminService : ServiceAdministratifService,
              public documentTypeService: DocumentTypeService)
  {
    super(router, dialog, _snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService, sdSectionnementService,
      acteurService,contribuableService, structureService, mandatService);

    this.formulaire =this.fb.group({
      numero: [null, [Validators.required]],
      action: [null, [Validators.required]],
      documents: new FormArray([]),

    });

  }
  ngOnInit(): void {
    this._adapter.setLocale("fr");
    this.formulaire.patchValue({
      numero: this.sdSectionnementElement.numero,
      action: this.transition.code
    });

    if (this.sdSectionnementElement.documents) {
      // console.log(this.planCadastral.documents);
      this.sdSectionnementElement.documents.map((document) => {
        this.documents.insert(0, this.createDocument(document));
      });
    }
  }

  createDocument(document: Document = null) {
    if(document != null){
      return this.fb.group({
        id: [document.id],
        libelle:[document.libelle, [Validators.required]],
        numero:[document.numero, [Validators.required]],
        pieceJointe:[document.pieceJointe],
        dateValidite: [document.dateValidite],
        documentType: [document.documentType.id, [Validators.required]],
        dateDoc: [document.dateDoc, [Validators.required]]
      });
    }else {
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

    let {
      numero,
      action,
      documents
    }=this.formulaire.value;
    let dataPost= {
      numero,
      action,
      documents
    };

    // console.log(dataPost);
    this.sdSectionnementService.executer(this.formulaire.value).subscribe(data => {
        this.loadingEvent.emit(false);
        this.openSnackBar("Edition document de migration sectionnement plan cadastral faite avec succès","OK");
        this.router.navigate([environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_SECTIONNEMENT]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }

  resetForm(){
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_SECTIONNEMENT}`]);
  }

}
