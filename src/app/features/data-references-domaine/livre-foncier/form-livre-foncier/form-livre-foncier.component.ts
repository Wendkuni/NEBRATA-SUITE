import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {of, Subject} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SycadUtils} from '@sycadShared/utils.functions';
import { LivreFoncierService } from '@sycadApp/services/data-references/system/livre-foncier.service';
import { ActivatedRoute } from '@angular/router';
import { LivreFoncier } from '@sycadApp/models/data-references/contribuables/global.model';
import { StructureAutocomplete } from '@sycadApp/models/data-references/organigramme/structure.model';
import { StructureService } from '@sycadApp/services/data-references/organigramme/structure.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-form-livre-foncier',
  templateUrl: './form-livre-foncier.component.html',
  styleUrls: ['./form-livre-foncier.component.scss']
})
export class FormLivreFoncierComponent implements OnInit {
  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults=false;
  public livreFoncier: LivreFoncier;
  public structureRemoteAutoComplete= new RemoteAutocomplete<StructureAutocomplete>();
  
  get libelle() { return this.formulaire.get('libelle'); }
  get code(){ return this.formulaire.get('code');}
  get circonscription(){ return this.formulaire.get('circonscription');}
  get structure(){ return this.formulaire.get('structure');}
  get dernierNumero(){ return this.formulaire.get('dernierNumero');}

  constructor( private _snackBar: MatSnackBar,
               public fb: FormBuilder,
               private location: Location,
               public route: ActivatedRoute,
               public structureService: StructureService,
               public livreFoncierService: LivreFoncierService )
  {
    this.formulaire = this.fb.group({
      id: null,
      code: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      libelle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      circonscription: [null],
      structure:[null],
      dernierNumero: [null]
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.livreFoncier = data.processus;
    });

    this.structureRemoteAutoComplete.initializeRemoteAutocompletion(this._onDestroy,this.structureService);

    if(this.livreFoncier){
      if(this.livreFoncier.structure){
        this.structureRemoteAutoComplete.listRessource$ = of([this.livreFoncier.structure]);
        this.structureRemoteAutoComplete.initialList = [this.livreFoncier.structure];
      }

      this.formulaire.patchValue({
        id: this.livreFoncier.id,
        code: this.livreFoncier.code,
        libelle: this.livreFoncier.libelle,
        circonscription: this.livreFoncier.circonscription,
        structure: this.livreFoncier.structure?.id,
        dernierNumero: this.livreFoncier.dernierNumero
      });
    } else {
      this.livreFoncier = new LivreFoncier();
    }
  }

  onSearchStructure(eventNgSelect){
    this.structureRemoteAutoComplete.term.next(eventNgSelect.term);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top'
    });
  }

  onSubmit() {

    if (!this.formulaire.valid) {
      return false;
    } else {

      if (this.formulaire.value) {
        this.isLoadingResults=true;
        if (this.formulaire.value.id) {
          this.livreFoncierService.update(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("Le livre foncier est modifié avec succès","OK");
              this.goBack();
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
              }
          );
        } else {
          this.livreFoncierService.add(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("Le livre foncier est ajouté avec succès","OK");
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

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  goBack() {
    this.location.back();
  }
  /*fin destructure d'instance*/

}
