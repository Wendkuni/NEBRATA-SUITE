import { DroitImmobilierService } from './../../../../../services/data-references/system/droit-immobilier.service';
import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {of, Subject} from 'rxjs';
import {
  DocumentType,
  TypeActe
} from '@sycadApp/models/data-references/system/document-type.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DocumentTypeService } from '@sycadApp/services/data-references/system/document-type.service';
import {SycadUtils} from '@sycadShared/utils.functions';
import { ActivatedRoute } from '@angular/router';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Location } from '@angular/common';
import { ParametreReport } from '@sycadApp/models/workflow/common/general';
import { DroitImmobilier } from '@sycadApp/models/data-references/system/droit-immobilier.model';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { DestinationAutocomplete } from '@sycadApp/models/data-references/organigramme/structure.model';
import { DestinationParcelleService } from '@sycadApp/services/bornage/destination-parcelle.service';

@Component({
  selector: 'app-form-document-type',
  templateUrl: './form-document-type.component.html',
  styleUrls: ['./form-document-type.component.scss']
})
export class FormDocumentTypeComponent implements OnInit {
  public documentTypeFormulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean=false;
  public documentType: DocumentType = new DocumentType();
  public destinationRemoteAutoComplete = new RemoteAutocomplete<DestinationAutocomplete>();
  public droitsReelsRemoteAutocomplete = new RemoteAutocomplete<DroitImmobilier>();
  public typeActeRemoteAutocomplete= new RemoteAutocomplete<any>();
  get code() {return this.documentTypeFormulaire.get('code')};
  get libelle() {return this.documentTypeFormulaire.get('libelle')};
  get templates() {return this.documentTypeFormulaire.get('templates') as FormArray;};
  get destinations() {return this.documentTypeFormulaire.get('destinations')};
  get droitsImmobiliers() {return this.documentTypeFormulaire.get('droitsImmobiliers')};
  public typeActes: { value: TypeActe; label: string }[] = [];
  constructor(public fb: FormBuilder,
              private route: ActivatedRoute,
              private location: Location,
              private mediaObserver: MediaObserver,
              private destinationService: DestinationParcelleService,
              private droitImmobilierService: DroitImmobilierService,
              private _snackBar: MatSnackBar, public documentTypeService: DocumentTypeService)
  {
    this.documentTypeFormulaire = this.fb.group({
      id: [null],
      code: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      libelle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      estTitreParcelle: [false],
      estTitreFoncier: [false],
      actif: [true],
      templates: new FormArray([]),
      typeActe: [null],
      destinations: [null],
      droitsImmobiliers: [null],
    });
  }
  ngOnInit(): void {

    this.destinationRemoteAutoComplete.initializeRemoteAutocompletion(this._onDestroy,this.destinationService);
    this.droitsReelsRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.droitImmobilierService);
    this. loadTypeActesOptions();
    this.route.data.subscribe(data => {
      this.documentType = data.processus;
    });

    if(this.documentType){
      if(this.documentType?.typeActe){
        this.typeActeRemoteAutocomplete.listRessource$=of([this.documentType.typeActe]);
        this.typeActeRemoteAutocomplete.initialList= [this.documentType.typeActe];
        this.documentTypeFormulaire.patchValue({
          typeActe : this.documentType.typeActe
        });
      }else{
        this.documentTypeFormulaire.patchValue({
          typeActe : null
        });
      }
      this.documentTypeFormulaire.patchValue({
        id: this.documentType.id,
        code: this.documentType.code,
        libelle: this.documentType.libelle,
        estTitreParcelle: this.documentType.estTitreParcelle,
        estTitreFoncier: this.documentType.estTitreFoncier,
        actif: this.documentType.actif,
        templates: [],
        destinations: [],
        droitsImmobiliers: []
      });

      this.documentType.parametreReport.map((template) => {
        this.templates.insert(0, this.createTemplate(template));
      });

      let idDestinations: number[] = [];
      let idDroitsImmobiliers: number[] = [];

      this.documentType.destination.map((dest) => {
        idDestinations.push(dest.id);
      });

      this.documentType.droitsImmobiliers.map((droit) => {
        idDroitsImmobiliers.push(droit.id);
      });

      this.documentTypeFormulaire.patchValue({
        destinations: idDestinations,
        droitsImmobiliers: idDroitsImmobiliers
      });

    } else {
      this.documentType = new DocumentType();

    }
    this.documentTypeFormulaire.get('estTitreParcelle')?.valueChanges.subscribe((isTitreParcelle) => {
      const typeActeControl = this.documentTypeFormulaire.get('typeActe');
      if (isTitreParcelle) {
        typeActeControl?.disable(); // Désactiver le champ
        typeActeControl?.setValue(null);
      } else {
        typeActeControl?.enable(); // Réactiver le champ
      }
    });
  }

  onSearchDestination(eventNgSelect){
    this.destinationRemoteAutoComplete.term.next(eventNgSelect.term);
  }

  onSearchDroitImmobilier(eventNgSelect){
    this.droitsReelsRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  loadTypeActesOptions() {
    this.typeActes = Object.keys(TypeActe)
      .filter(key => isNaN(Number(key))) // Filtrer les clés qui ne sont pas des nombres
      .map(key => ({
        value: TypeActe[key],
        label: TypeActe[key]
      }));
  }
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';

    });
  }
  clearSelection(event: Event): void {
    event.stopPropagation(); // Empêche la fermeture automatique du select
    this.documentTypeFormulaire.get('typeActe')?.setValue(null);
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }

  onSubmit(){
    if (!this.documentTypeFormulaire.valid) {
      return false;
    } else {

      if (this.documentTypeFormulaire.value) {

        this.isLoadingResults=true;
        if (this.documentTypeFormulaire.value.id) {
          this.documentTypeService.update(this.documentTypeFormulaire.value).subscribe(
            data => {
              this.openSnackBar("Type document modifié avec succès", "ok");
              this.isLoadingResults=false;
              this.goBack();

            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        } else {
          this.documentTypeService.add(this.documentTypeFormulaire.value).subscribe(
            data => {
              this.openSnackBar("Type document ajouté avec succès", "ok");
              this.isLoadingResults=false;
              this.goBack();

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

  createTemplate(parametreReport: ParametreReport = null) {

    if (parametreReport != null) {

      return this.fb.group({
        id: [parametreReport.id],
        type: [this.documentTypeFormulaire.value.id],
        file: [parametreReport.file, Validators.compose([Validators.required])],
        code: [parametreReport.code, Validators.compose([Validators.required])],
        description: [parametreReport.description, Validators.compose([Validators.required])],
      });
    } else {
      return this.fb.group({
        type: [null],
        file: [null, Validators.compose([Validators.required])],
        code: [null, Validators.compose([Validators.required])],
        description: [null, Validators.compose([Validators.required])],
      });
    }

  }
  addNewParametreReport(){
    this.templates.insert(0, this.createTemplate());
  }

  removeParametreReport(i){
    this.templates.removeAt(i);
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
