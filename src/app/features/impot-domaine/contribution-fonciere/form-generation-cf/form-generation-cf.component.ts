import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {catchError, map, of, Subject, timeout} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import { TypePieceIdentite } from '@sycadApp/models/data-references/system/model';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import {SycadUtils} from '@sycadShared/utils.functions';
import { CalendrierFiscaleService } from '@sycadApp/services/impot/calendrier-fiscale.service';
import { ExerciceFiscaleService } from '@sycadApp/services/impot/exercice-fiscale.service';
import { ContributionFonciereService } from '@sycadApp/services/impot/contribution-fonciere.service';
import { RemoteAutocomplete, RemoteAutocompleteExtend } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { CalendrierFiscale, ExerciceFiscale } from '@sycadApp/models/impot/exercice-fiscale.model';


@Component({
  selector: 'app-form-generation-cf',
  templateUrl: './form-generation-cf.component.html',
  styleUrls: ['./form-generation-cf.component.scss']
})
export class FormGenerationContributionFonciereComponent implements OnInit {
  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults=false;

  public remoteAutocompleteExerciceFiscale = new RemoteAutocompleteExtend<ExerciceFiscale>();
  public remoteAutocompleteCalendrierFiscale  = new RemoteAutocompleteExtend<CalendrierFiscale>();

  get exerciceFiscale() { return this.formulaire.get('exerciceFiscale'); }
  get calendrierFiscale() { return this.formulaire.get('calendrierFiscale'); }



  constructor( public dialogRef: MatDialogRef<FormGenerationContributionFonciereComponent>, private _snackBar: MatSnackBar,
               public fb: FormBuilder,
               public contributionFonciereService: ContributionFonciereService,
               public exerciceFiscaleService: ExerciceFiscaleService,
               public calendrierFiscaleService: CalendrierFiscaleService)
  {
    this.formulaire = this.fb.group({
      exerciceFiscale: [null, [Validators.required]],
      calendrierFiscale: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {

    let callbackAutocompleteEF=(search:string,params:Map<string,any>)=> {
      return this.exerciceFiscaleService.autocompletion(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };
    this.remoteAutocompleteExerciceFiscale.callbackAutocomplete=callbackAutocompleteEF;
    this.remoteAutocompleteExerciceFiscale.initializeRemoteAutocompletion(this._onDestroy);


    let callbackAutocompleteCF=(search:string,params:Map<string,any>)=> {
      return this.calendrierFiscaleService.autocompletion(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };
    this.remoteAutocompleteCalendrierFiscale.callbackAutocomplete=callbackAutocompleteCF;
    this.remoteAutocompleteCalendrierFiscale.initializeRemoteAutocompletion(this._onDestroy);
    this.remoteAutocompleteCalendrierFiscale.params.set("etat","OUVERT");
    this.remoteAutocompleteCalendrierFiscale.params.set("titre","118");

  }


  public onSearchExerciceFiscale(eventNgSelect) {
    this.remoteAutocompleteExerciceFiscale.term.next(eventNgSelect.term);
  }

  public onSearchCalendrierFiscale(eventNgSelect) {
    this.remoteAutocompleteCalendrierFiscale.term.next(eventNgSelect.term);
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
        this.contributionFonciereService.generation(this.formulaire.value).pipe( timeout(30*60*1000)).subscribe(
          data => {
             this.isLoadingResults=false;
            this.dialogRef.close(data);
          },
          errorResponse => {
            console.log("errorResponse",errorResponse)
           this.isLoadingResults=false;
            SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
        );
      }
    }

  }


  //
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
