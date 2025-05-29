import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {of, Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CategorieActeur} from '@sycadApp/models/data-references/contribuables/global.model';
import { CategorieActeurService } from '@sycadApp/services/data-references/system/categorie-acteur.service';
import {RemoteErrorMessageSnackbarComponent} from '@sycadApp/shared/app-toast/snackbar.component';
import {SycadUtils} from '@sycadShared/utils.functions';
import { RolesService } from '@sycadApp/services/data-references/security/roles-services';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { RoleAutocomplete } from '@sycadApp/models/data-references/security/role.model';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { getErrors } from '@sycadApp/shared/validators/global-pattern';
import { ProfilAutocomplete } from '@sycadApp/models/data-references/security/profil.model';
import { ProfilesService } from '@sycadApp/services/data-references/security/profiles.service';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-form-categorie-acteur',
  templateUrl: './form-categorie-acteur.component.html',
  styleUrls: ['./form-categorie-acteur.component.scss']
})
export class FormCategorieActeurComponent implements OnInit {
  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults = false;
  public profilRemoteAutocomplete = new RemoteAutocomplete<ProfilAutocomplete>();
  categorieActeur:CategorieActeur;

  get libelle() { return this.formulaire.get('libelle'); }
 

  constructor(
    private router: Router,private _snackBar: MatSnackBar,
              public fb: FormBuilder, public categorieActeurService: CategorieActeurService,
   private route: ActivatedRoute,public profilService:ProfilesService)
  {
    this.categorieActeur=this.route.snapshot.data["categorieActeur"];
    this.formulaire = this.fb.group({
      id: null,
      libelle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      code: [null],
      profils:[null]
    });
  }
  public formErrors: Array<string>;
  ngOnInit(): void {

    this.profilRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.profilService);

    this.formulaire.valueChanges.pipe(
      takeUntil(this._onDestroy)
    ).subscribe(() => {
      this.formErrors = getErrors(this.formulaire);
    });
    
    if(this.categorieActeur){
      if(this.categorieActeur?.profils){
          this.profilRemoteAutocomplete.listRessource$= of(this.categorieActeur.profils)
          this.profilRemoteAutocomplete.initialList= this.categorieActeur.profils
      }
      this.formulaire.patchValue({
        id: this.categorieActeur.id,
        libelle: this.categorieActeur.libelle,
        code: this.categorieActeur.code,
        profils:this.categorieActeur.profils.map(profils => profils.id)
      });
      this.dataSourceProfils= this.categorieActeur.profils;
    }else {
      this.categorieActeur = new CategorieActeur();
    }
  }


  public displayedColumnsProfil: string[] = ['libelle'];
  public dataSourceProfils = [];

  public onChangeRole(profils){
    this.dataSourceProfils= profils;
  }

  public onSearchRole(eventNgSelect){
    this.profilRemoteAutocomplete.term.next(eventNgSelect.term);
 }
 public  resetForm(){
  this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_CATEGORIE_ACTEUR}`]);

}
//  isLoadingResults:boolean=false;

  onSubmit() {

    if (!this.formulaire.valid) {
      return false;
    } else {

      if (this.formulaire.value) {
        this.isLoadingResults=true;
        if (this.formulaire.value.id) {
          this.categorieActeurService.update(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar(" La catégorie de l'acteur est  modifiée avec succès","OK");
              this.router.navigate([environment.FRONTEND_ROUTES.CONFIGURATION_CATEGORIE_ACTEUR]);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
              }
          );
        } else {
          this.categorieActeurService.add(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar(" La catégorie de l'acteur est ajoutée avec succès","OK");
              this.router.navigate([environment.FRONTEND_ROUTES.CONFIGURATION_CATEGORIE_ACTEUR]);
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
 

  //
  /*destructure d'instance*/

 
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  /*fin destructure d'instance*/
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }
}
