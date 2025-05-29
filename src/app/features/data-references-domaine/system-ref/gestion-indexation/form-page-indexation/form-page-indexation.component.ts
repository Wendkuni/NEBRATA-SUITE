import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SycadUtils} from '@sycadShared/utils.functions';
import {Subject} from "rxjs";
import {IndexationService} from '@sycadApp/services/data-references/system/indexation.service';
import {Indexation} from '@sycadApp/models/data-references/system/model';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-form-page-indexation',
  templateUrl: './form-page-indexation.component.html',
  styleUrls: ['./form-page-indexation.component.scss']
})
export class FormPageIndexationComponent implements OnInit {

 
  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean = false;

  get libelle() {return this.formulaire.get('libelle')};

  constructor(public dialogRef: MatDialogRef<FormPageIndexationComponent>,  private mediaObserver: MediaObserver,
              @Inject(MAT_DIALOG_DATA)  public indexation: Indexation, private _snackBar: MatSnackBar,
              public fb: FormBuilder,
              public indexService: IndexationService)
  {
    this.formulaire = this.fb.group({
      id: null,
      libelle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
    });
  }
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
     // console.log("this.activeMediaQuery",this.activeMediaQuery)
    });
  }
  ngOnInit(): void {
    if(this.indexation){
      this.formulaire.setValue({
        id: this.indexation.id,
        libelle: this.indexation.libelle
      });
    } else {
      this.indexation = new Indexation();
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top'

    });
  }

  onSubmit(){
    if (!this.formulaire.valid) {
      return false;
    } else {

      if (this.formulaire.value) {
        this.isLoadingResults = true;
        if (this.formulaire.value.id) {
          this.indexService.update( this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults = false;
              this.openSnackBar("L'élément indexable est modifié avec succès","OK");
              this.dialogRef.close(data);
            },
            errorResponse => {
              this.isLoadingResults = false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        } else {
          this.indexService.add(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults = false;
              this.openSnackBar("L'élément indexable est ajouté avec succès","OK");
              this.dialogRef.close(data);
            },
            errorResponse => {
              this.isLoadingResults = false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        }
      }
    }
  }

  closeFormModal(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
