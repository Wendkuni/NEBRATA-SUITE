import { Component, Inject, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import {  Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ContribuableMoralService} from '@sycadApp/services/data-references/contribuables/contribuable-moral-service';
import { StatusJuridiqueService } from '@sycadApp/services/data-references/system/status-juridique.service';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { StatusJuridiqueAutocomplete } from '@sycadApp/models/data-references/system/model';
import { GeneralContribuable } from '@sycadApp/models/data-references/contribuables/global.model';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { AttributsExist } from '@sycadApp/shared/validators/remote/attributs-exist';
import { Subject } from 'rxjs';
import { ContactContribuableService } from '@sycadApp/services/data-references/system/contact.service';
import { RechercheContribuableIFU } from '../../data-references-domaine/recherche-ifu/recherche-ifu.component';
import { ContribuableMoraleElement } from '@sycadApp/models/data-references/contribuables/contribuable-moral.model';

@Component({
  selector: 'app-rapide-contribuable-moral-form',
  templateUrl: './rapide-contribuable-moral-form.component.html',
  styleUrls: ['./rapide-contribuable-moral-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RapideContribuableMoralFormComponent implements OnInit {
  public formulaire: FormGroup;
  public foundContribuable: boolean;
  public triedIfuSearch: boolean;
  private _onDestroy = new Subject<void>();

  public statusJuridiqueRemoteAutocomplete = new RemoteAutocomplete<StatusJuridiqueAutocomplete>();

  @Input("updateContribuable")
  public updateContribuable: String = null;

  public contribuableUpdate: ContribuableMoraleElement = null;

  @Output("ajouterContribuable")
  public ajouterContribuable: EventEmitter<GeneralContribuable> = new EventEmitter<GeneralContribuable>();

  get denomination() { return this.formulaire.get('denomination'); }
  get sigle() { return this.formulaire.get('sigle'); }
  get statusJuridique() { return this.formulaire.get('statusJuridique'); }
  get pieceOfficielle() { return this.formulaire.get('pieceOfficielle'); }

  constructor(public dialogRef: MatDialogRef<RapideContribuableMoralFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar,
              public fb: FormBuilder,
              public statutJuridiqueService: StatusJuridiqueService,
              public contribuableMoralService: ContribuableMoralService,
              public contactContribuableService: ContactContribuableService)
  {
    this.formulaire = this.fb.group({
      guid: null,
      denomination: [null, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
      sigle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      statusJuridique: [null],
      pieceOfficielle:this.fb.group({
        categorie: [null, [Validators.required,Validators.maxLength(150),Validators.minLength(2)]],
        dateExpiration: [null],
        dateObtention: [null, Validators.compose([Validators.required])],
        numero: [null,
          Validators.compose([Validators.required,Validators.maxLength(150),Validators.minLength(2)]),
          [AttributsExist.validateNumeroPieceExistFn(this.contactContribuableService,true)]],
        nip: [null],
        autoriteDeDelivrance: [null],
        lieuDeDelivrance: [null],
        codeDownload: null,
      }),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.updateContribuable) {

      this.contribuableMoralService.get(changes.updateContribuable.currentValue).subscribe(data =>{
        this.contribuableUpdate = data;

      }, errorResponse => {
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      });
    }
  }

  ngOnInit(): void {

    this.statusJuridiqueRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.statutJuridiqueService);
  }

  public onSearchStatusJuridique(eventNgSelect) {
    this.statusJuridiqueRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  importContribuable(contribuable: GeneralContribuable) {
    if(contribuable){
      this.ajouterContribuable.emit(contribuable);
    }
  }
  trouveContribuable(rechercheContribuableIFU: RechercheContribuableIFU){
    if(!rechercheContribuableIFU.success){
      SycadUtils.notifyRemoteError( {message: rechercheContribuableIFU.message}, this._snackBar);
    }else {
      this.openSnackBar("Un résultat a été trouvé","OK");
    }

  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }
  onSubmit() {

    if (!this.formulaire.valid) {
      return false;
    } else {

    if (this.formulaire.value) {
      if(this.updateContribuable != null){
        this.formulaire.value.guid = this.updateContribuable;
        this.contribuableMoralService.update(this.formulaire.value).subscribe(
          data => {
            this.dialogRef.close(data);
          },
          errorResponse => {
            SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
        );
      }
      else{
        this.contribuableMoralService.add(this.formulaire.value).subscribe(
          data => {
            this.dialogRef.close(data);
          },
          errorResponse => {
            SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
        );
      }
    }
  }
}


  /*destructure d'instance*/

  closeFormModal(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  /*fin destructure d'instance*/

}

