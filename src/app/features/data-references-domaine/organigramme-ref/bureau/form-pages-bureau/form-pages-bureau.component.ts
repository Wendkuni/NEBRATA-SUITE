import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
  StructureAutocomplete,
} from "@sycadApp/models/data-references/organigramme/structure.model";
import {of, Subject} from "rxjs";
import { BureauElement } from '@sycadApp/models/data-references/organigramme/bureau.model';
import {RemoteAutocomplete} from "@sycadApp/shared/form-components/model/remote-autocomplete";
import {ServiceAutocomplete} from "@sycadApp/models/data-references/organigramme/service.model";
import {MediaChange, MediaObserver} from "@angular/flex-layout";
import {ActivatedRoute, Router} from "@angular/router";
import {AppConfirmService} from "@sycadShared/app-confirm/app-confirm.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import { ServiceAdministratifService } from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';
import {DateAdapter} from "@angular/material/core";
import {takeUntil} from "rxjs/operators";
import {getErrors} from "@sycadShared/validators/global-pattern";
import {SycadUtils} from "@sycadShared/utils.functions";
import { BureauService } from '@sycadApp/services/data-references/organigramme/bureau.service';
import {environment} from "../../../../../../environments/environment";
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';

@Component({
  selector: 'app-form-pages-bureau',
  templateUrl: './form-pages-bureau.component.html',
  styleUrls: ['./form-pages-bureau.component.scss']
})
export class FormPagesBureauComponent implements OnInit {
  public formulaire: FormGroup;
  public bureau: BureauElement;
  private _onDestroy = new Subject<void>();

  public structureRemoteAutocomplete = new RemoteAutocomplete<StructureAutocomplete>();
  public serviceRemoteAutocomplete = new RemoteAutocomplete<ServiceAutocomplete>();
  public isLoadingResults = false;

  get nom() {
    return this.formulaire.get('nom');
  }

  get code() {
    return this.formulaire.get('code');
  }

  get sigle() {
    return this.formulaire.get('sigle');
  }

  get structure() {
    return this.formulaire.get('structure');
  }

  get service() {
    return this.formulaire.get('service');
  }
get localisation(){
    return this.formulaire.get('localisation');
}
  public activeMediaQuery = '';

  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  constructor(public fb: FormBuilder, private router: Router,
              public confirmService: AppConfirmService,
              private route: ActivatedRoute,
              private _snackBar: MatSnackBar, private mediaObserver: MediaObserver,
              public bureauService: BureauService,
              public serviceService: ServiceAdministratifService,
              public structureService: StructureService,
              private _adapter: DateAdapter<any>,) {
    this.bureau = this.route.snapshot.data["bureau"];
    this.formulaire = this.fb.group({
      id: null,
      code: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      sigle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      nom: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      structure: [null],
      service: [null],
      localisation: this.fb.group({
        longitude: [null],
        lattitude: [null],
        designation: [null],
        localite: [null],
        quartier: [null],
        rue: [null],
        immeuble: [null],
        etage: [null],
        porte: [null],
        emailDeService: [null],
        telephoneDeService: [null]
      })
    });
  }

  public formErrors: Array<string>;

  private processOrganigrammeWhenChanging(): void {
    this.service.valueChanges.subscribe(x => {
      if (x) {
        this.structure.reset();
      }
    });

    this.structure.valueChanges.subscribe(x => {
      if (x) {
        this.service.reset();
      }
    });
  }

  ngOnInit(): void {


  setTimeout(()=>{  

      this.formulaire.valueChanges.pipe(
        takeUntil(this._onDestroy)
      ).subscribe(() => {
        this.formErrors = getErrors(this.formulaire);
      });
     });

    this._adapter.setLocale("fr");

    this.processOrganigrammeWhenChanging();
    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.structureService);
    this.serviceRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.serviceService);
    if (this.bureau) {

      if (this.bureau.structure) {
        this.structureRemoteAutocomplete.listRessource$ = of([this.bureau.structure]);
        this.structureRemoteAutocomplete.initialList = [this.bureau.structure];
      }

      if (this.bureau.service) {
        this.serviceRemoteAutocomplete.listRessource$ = of([this.bureau.service]);
        this.serviceRemoteAutocomplete.initialList = [this.bureau.service];
      }

      this.formulaire.patchValue({
        id: this.bureau.id,
        nom: this.bureau.nom,
        code: this.bureau.code,
        sigle: this.bureau.sigle,
        structure: (this.bureau.structure) ? this.bureau.structure.id : null,
        service: (this.bureau.service) ? this.bureau.service.id : null,
        localisation: this.bureau.localisation || {}
      });
    }else {
      this.bureau = new BureauElement();
    }

  }
  public onSearchStructure(eventNgSelect) {
    this.structureRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchService(eventNgSelect) {
    this.serviceRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    } else {
      if (this.formulaire.value) {
        this.isLoadingResults=true;
        if (this.formulaire.value.id) {

          this.bureauService.update(this.formulaire.value).subscribe(data => {
              this.isLoadingResults=false;
              this.openSnackBar("Le bureau est modifié avec succès","OK");
              this.router.navigate([environment.FRONTEND_ROUTES.ORGANIGRAMME_BUREAU]);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );

        } else {
          this.bureauService.add(this.formulaire.value).subscribe(data => {
              this.isLoadingResults=false;
              this.openSnackBar("Le bureau est ajouté avec succès","OK");
              this.router.navigate([environment.FRONTEND_ROUTES.ORGANIGRAMME_BUREAU]);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        }
      }
    }
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }
  resetForm(){
    this.router.navigate([`${environment.FRONTEND_ROUTES.ORGANIGRAMME_BUREAU}`]);

  }
}
