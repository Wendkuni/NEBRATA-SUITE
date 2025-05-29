import { Component, Input, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GenericProcessusDatasource } from '@sycadApp/models/generic-datasource-processus';
import { Dossier, Transition } from '@sycadApp/models/workflow/common/general';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { TransitionComponent } from '../transition/component.transition';

@Component({
  selector: 'app-renvoyer-dossier-transition',
  templateUrl: './renvoyer-dossier-transition.component.html',
  styleUrls: ['./renvoyer-dossier-transition.component.scss']
})
export class RenvoyerDossierTransitionComponent extends TransitionComponent implements OnInit {

  @Input()
  public dossierProcessus: Dossier;

  @Input()
  public transition: Transition;

  @Input()
  public frontendUrl: String;

  @Input()
  public processusService: GenericProcessusDatasource<Dossier, Dossier>;

  
  get dossier() { return this.formulaire.get('dossier'); }

  constructor(
    public router: Router,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder){
     super(mediaObserver);


     this.formulaire = this.fb.group({
        action: [null, Validators.compose([Validators.required])],
        numero: [null, Validators.compose([Validators.required])],
        dossier : this.fb.group({
          observation: [null]
        })

      });
  }

  ngOnInit(): void {

    this.formulaire.patchValue({
      numero: this.dossierProcessus.numero,
      action: this.transition.code
    });

  }
  resetForm() {
    if (this.dossierProcessus.numero) {
      this.router.navigate([`${this.frontendUrl}`]);
    } else {
      this.formulaire.reset();
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
    }
    this.loadingEvent.emit(true);
      let {numero,action}=this.formulaire.value;
    let {observation}=this.formulaire.value.dossier;
    let dataPost= {
      numero,action,observation
    };
    this.processusService.executer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
        this.openSnackBar('Le dossier a été renvoyé avec succès', 'OK');
        this.router.navigate([this.frontendUrl]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }

}
