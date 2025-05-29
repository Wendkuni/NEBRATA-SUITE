import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TransitionPlanCadastralComponent } from '@sycadApp/shared/form-components/processus/transition.plan-cadastral.component';

import {PlanCadastralSectionnementElement} from '@sycadApp/models/workflow/common/sectionnement.model';
import {RemoteAutocomplete} from '@sycadApp/shared/form-components/model/remote-autocomplete';
import {DocumentType} from '@sycadApp/models/data-references/system/document-type.model';
import {Document} from '@sycadApp/models/workflow/common/general';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {MediaObserver} from '@angular/flex-layout';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import { BureauService } from '@sycadApp/services/data-references/organigramme/bureau.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import { ServiceAdministratifService } from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { DocumentTypeService } from '@sycadApp/services/data-references/system/document-type.service';
import { PlanCadastralSectionnementService } from '@sycadApp/services/workflow/common/sectionnement-services';

import {environment} from '../../../../../../environments/environment';
import {SycadUtils} from '@sycadShared/utils.functions';
import { DropzoneComponent, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { Processus } from '@sycadApp/models/workflow/common/general';

@Component({
  selector: 'sec-constructeur-document',
  templateUrl: './constructeur-document.component.html',
  styleUrls: ['./constructeur-document.component.scss']
})
export class ConstructeurDocumentComponent extends TransitionPlanCadastralComponent<PlanCadastralSectionnementElement>  implements OnInit {

  @Input()
  public processus: Processus;

  get documents() { return this.formulaire.controls.documents as FormArray; }

  constructor(public router: Router,
              public _snackBar: MatSnackBar,
              public confirmService: AppConfirmService,
              public _adapter: DateAdapter<any>,
              public mediaObserver: MediaObserver,
              public fb: FormBuilder,
              public planCadastralService: PlanCadastralSectionnementService,
              public bureauService : BureauService, public structureService : StructureService,
              public serviceAdminService : ServiceAdministratifService, public communeService: CommunesService,
              public documentTypeService: DocumentTypeService)
  {
    super(router, _snackBar, confirmService, _adapter, mediaObserver,fb);

    this.formulaire =this.fb.group({
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
     // console.log(this.planCadastral.documents);
      this.planCadastral.documents.map((document) => {
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
    this.planCadastralService.executer(this.formulaire.value).subscribe(data => {
      this.loadingEvent.emit(false);
        this.openSnackBar("Edition document sectionnement plan cadastral faite avec succès","OK");
        this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_SECTIONNEMENT]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }

  resetForm(){
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_SECTIONNEMENT}`]);
    /*
    if(this.planCadastral.numero) {
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_SECTIONNEMENT}`]);
    }else {
      this.formulaire.reset();
    } */
  }



}
