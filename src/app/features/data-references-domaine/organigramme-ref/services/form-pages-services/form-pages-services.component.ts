import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
  StructureAutocomplete
} from "@sycadApp/models/data-references/organigramme/structure.model";
import {of, Subject} from "rxjs";
import {ServiceElement} from "@sycadApp/models/data-references/organigramme/service.model";
import {RemoteAutocomplete} from "@sycadApp/shared/form-components/model/remote-autocomplete";
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {ActivatedRoute, Router} from "@angular/router";
import {AppConfirmService} from "@sycadShared/app-confirm/app-confirm.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MediaChange, MediaObserver} from "@angular/flex-layout";
import {DateAdapter} from "@angular/material/core";
import {takeUntil} from "rxjs/operators";
import {getErrors} from "@sycadShared/validators/global-pattern";
import {environment} from "../../../../../../environments/environment";
import {SycadUtils} from "@sycadShared/utils.functions";
import { ServiceAdministratifService } from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';

@Component({
  selector: 'app-form-pages-services',
  templateUrl: './form-pages-services.component.html',
  styleUrls: ['./form-pages-services.component.scss']
})
export class FormPagesServicesComponent implements OnInit {
  public formulaire: FormGroup;
  public service: ServiceElement;
  private _onDestroy = new Subject<void>();

  public isLoadingResults = false;
  public structureRemoteAutocomplete = new RemoteAutocomplete<StructureAutocomplete>();
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  get code() { return this.formulaire.get('code'); }
  get nom() { return this.formulaire.get('nom'); }
  get sigle() { return this.formulaire.get('sigle'); }
  get structure() { return this.formulaire.get('structure'); }
  get localisation(){ return this.formulaire.get('localisation')}

  constructor(
               public fb: FormBuilder, private router: Router,
               public confirmService: AppConfirmService,
               private route: ActivatedRoute,
               private _snackBar: MatSnackBar, private mediaObserver: MediaObserver,
               public structureService: StructureService,
               private _adapter: DateAdapter<any>,
               public serviceAdService: ServiceAdministratifService)
  {
    this.service = this.route.snapshot.data["service"];
    this.formulaire = this.fb.group({
      id: null,
      nom: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      code: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      sigle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      structure:[null, Validators.compose([Validators.required])],
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
  ngOnInit(): void {

    setTimeout(()=>{  

      this.formulaire.valueChanges.pipe(
        takeUntil(this._onDestroy)
      ).subscribe(() => {
        this.formErrors = getErrors(this.formulaire);
      });
     });

    this._adapter.setLocale("fr");

    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.structureService);

    if (this.service) {
      this.structureRemoteAutocomplete.listRessource$=of([this.service.structure]);
      this.structureRemoteAutocomplete.initialList=[this.service.structure];
      this.formulaire.patchValue({
        id: this.service.id,
        code: this.service.code,
        nom: this.service.nom,
        sigle: this.service.sigle,
        structure: this.service.structure.id,
        localisation: this.service.localisation || {}
    });
  }else {
    this.service = new ServiceElement();
    }
  }
  public onSearchStructure(eventNgSelect){
    this.structureRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  resetForm(){
    this.router.navigate([`${environment.FRONTEND_ROUTES.ORGANIGRAMME_SERVICE}`]);

  }
  onSubmit() {




    if (!this.formulaire.valid) {
      return false;
    } else {
      if (this.formulaire.value) {
        this.isLoadingResults=true;
        if (this.formulaire.value.id) {

          this.serviceAdService.update(this.formulaire.value).subscribe(data => {
              this.isLoadingResults=false;
              this.openSnackBar("Le service est modifié avec succès","OK");
              this.router.navigate([environment.FRONTEND_ROUTES.ORGANIGRAMME_SERVICE]);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );

        } else {
          this.serviceAdService.add(this.formulaire.value).subscribe(data => {
              this.isLoadingResults=false;
              this.openSnackBar("Le service est ajouté avec succès","OK");
              this.router.navigate([environment.FRONTEND_ROUTES.ORGANIGRAMME_SERVICE]);
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


  }

