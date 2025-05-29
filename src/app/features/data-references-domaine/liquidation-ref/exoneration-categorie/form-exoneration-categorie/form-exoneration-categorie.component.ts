import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  ExonerationCategorie
} from '@sycadApp/models/evaluation/exoneration-categorie.model';
import {of, Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {DateAdapter} from '@angular/material/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ExonerationCategorieService } from '@sycadApp/services/evaluation/exoneration-categorie.service';
import {takeUntil} from 'rxjs/operators';
import {getErrors} from '@sycadShared/validators/global-pattern';
import {SycadUtils} from '@sycadShared/utils.functions';
import { ProcessusService } from '@sycadApp/services/workflow/processus.service';
import {RemoteAutocomplete} from '@sycadApp/shared/form-components/model/remote-autocomplete';
import {Processus} from '@sycadApp/models/workflow/common/general';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-form-exoneration-categorie',
  templateUrl: './form-exoneration-categorie.component.html',
  styleUrls: ['./form-exoneration-categorie.component.scss']
})
export class FormExonerationCategorieComponent implements OnInit {
  public formulaire: FormGroup;
  public exonerationCategorie: ExonerationCategorie;
  private _onDestroy = new Subject<void>();
  public isLoadingResults = false;


  public processusRemoteAutocomplete = new RemoteAutocomplete<Processus>();

  get code(){return this.formulaire.get('code');}
  get etatMev(){return this.formulaire.get('etatMev');}
  get taux(){return this.formulaire.get('taux');}
  get montant(){return this.formulaire.get('montant');}

  constructor(private router: Router,
              public confirmService: AppConfirmService,
              private route: ActivatedRoute, private mediaObserver: MediaObserver,
              private _adapter: DateAdapter<any>, private _snackBar: MatSnackBar,
              public fb: FormBuilder, public exonerationCategorieService: ExonerationCategorieService,
              public processusService: ProcessusService)
  {
    this.exonerationCategorie = this.route.snapshot.data["exonerationCategorie"];
    this.formulaire = this.fb.group({
      id: [null],
      code: [null, [Validators.required]],
      etatMev: [null, [Validators.required]],
      codeProcessus: [null, [Validators.required]],
      motif: [null],
      taux: [null],
      montant: [null],
      refLoi: [null],
      actif: [null || false]
    });
  }
  public formErrors: Array<string>;
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  ngOnInit(): void {
    this.processusRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.processusService);
    this.formulaire.valueChanges.pipe(
      takeUntil(this._onDestroy)
    ).subscribe(() => {
      this.formErrors = getErrors(this.formulaire);
    });

    this._adapter.setLocale("fr");

    this.montant.valueChanges.subscribe(x=>{
      if(x){
        this.taux.reset();    
      }
     
    });
    
    this.taux.valueChanges.subscribe(x=>{
      if(x){
        this.montant.reset();
      }
     
    });

    if(this.exonerationCategorie){
      if(this.exonerationCategorie.codeProcessus){
        this.processusRemoteAutocomplete.listRessource$= of([this.exonerationCategorie.codeProcessus]);
        this.processusRemoteAutocomplete.initialList=[this.exonerationCategorie.codeProcessus];
      }
      this.formulaire.patchValue({
        id: this.exonerationCategorie.id,
        code: this.exonerationCategorie.code,
        taux: this.exonerationCategorie.taux,
        motif: this.exonerationCategorie.motif,
        montant: this.exonerationCategorie.montant,
        etatMev: this.exonerationCategorie.etatMev,
        refLoi: this.exonerationCategorie.refLoi,
        codeProcessus: this.exonerationCategorie.codeProcessus,
        actif: this.exonerationCategorie.actif
      });
    }else {
      this.exonerationCategorie = new ExonerationCategorie();
    }
  }
  resetForm(){
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_EXONERATION_CATEGORIE}`]);

  }
  onSearchProcessus(eventNgSelect){
    this.processusRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  onSubmit() {

    if (!this.formulaire.valid) {
      return false;
    } else {

      if (this.formulaire.value) {
        this.isLoadingResults=true;
        if (this.formulaire.value.id) {
          this.exonerationCategorieService.update(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("Exoneration catégorie modifiée avec succès","OK");
              this.router.navigate([environment.FRONTEND_ROUTES.CONFIGURATION_EXONERATION_CATEGORIE]);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        } else {
          this.exonerationCategorieService.add(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("Exoneration catégorie  ajoutée avec succès","OK");
              this.router.navigate([environment.FRONTEND_ROUTES.CONFIGURATION_EXONERATION_CATEGORIE]);
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  public onUploadInit(args: any): void {

  }
}
