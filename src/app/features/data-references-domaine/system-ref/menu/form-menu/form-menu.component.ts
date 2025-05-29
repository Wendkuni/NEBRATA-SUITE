
import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RemoteAutocomplete} from '@sycadApp/shared/form-components/model/remote-autocomplete';

import {of, Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpClient} from '@angular/common/http';
import { MenuService } from '@sycadApp/services/data-references/system/menu.service';
import { MenuIconeService } from '@sycadApp/services/data-references/system/menu-icone.service';
import {SycadUtils} from '@sycadShared/utils.functions';
import { AdvancedRemoteAutocomplete } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/advanced-remote-autocomplete';

import { Icon, Menu } from '../model';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {getErrors} from '@sycadShared/validators/global-pattern';
import {environment} from '../../../../../../environments/environment';

@Component({
  selector: 'app-form-menu',
  templateUrl: './form-menu.component.html',
  styleUrls: ['./form-menu.component.scss']
})
export class FormMenuComponent implements OnInit {
public formulaire: FormGroup;
private _onDestroy = new Subject<void>();
public isLoadingResults:boolean = false;
public iconeRemeoteAutocomplete = new RemoteAutocomplete<Icon>();
public parentRemoteAutocomplete = new RemoteAutocomplete<Menu>();
public menu: Menu;
public imgIcon; // = this.menu.icon;


get titre() { return this.formulaire.get('titre');}
get icon() { return this.formulaire.get('icon');}

  constructor(private _snackBar: MatSnackBar,
              public fb: FormBuilder,
              private http: HttpClient, public menuService: MenuService,
              public menuIconeService: MenuIconeService,
              private route: ActivatedRoute,
              private router: Router)
  {
    this.menu = this.route.snapshot.data["menu"];

    //parent, hasSubMenu, icon, titre, ordre
    this.formulaire = this.fb.group({
      id: null,
      titre: [null, Validators.compose([Validators.required])],
      ordre: [null],
      hasSubMenu: [null],
      icon: [null, Validators.compose([Validators.required])],
      parent: [null],
    });
  }

  public formErrors: Array<string>;
  ngOnInit(): void {
    this.parentRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.menuService);
    this.iconeRemeoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.menuIconeService);

    this.formulaire.valueChanges.pipe(
      takeUntil(this._onDestroy)
    ).subscribe(() => {
      this.formErrors = getErrors(this.formulaire);
    });


    if(this.menu){
      this.imgIcon = this.menu.icon;
      if(this.menu.parentId){
        this.menuService.get(this.menu.parentId).subscribe(
          (menu : any) => {
            this.parentRemoteAutocomplete.listRessource$= of([menu]);
            this.parentRemoteAutocomplete.initialList=[menu];
          }
        )
      }
      if(this.menu.icon){
        this.iconeRemeoteAutocomplete.listRessource$ = of([this.menu.icon]);
        this.iconeRemeoteAutocomplete.initialList = [{cssClasse: this.menu.icon}];
       // console.log('------', this.iconeRemeoteAutocomplete);
      }
      this.formulaire.setValue({
        id: this.menu.id,
        titre: this.menu.titre,
        ordre: this.menu.ordre,
        hasSubMenu: this.menu.hasSubMenu,
        parent: this.menu.parentId,
        icon: this.menu.icon
      });
    }else {
      this.menu = new Menu();
    }
  }
  onSearchParent(eventNgSelect){
    this.parentRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  onSearchIcon(eventNgSelect){
    this.iconeRemeoteAutocomplete.term.next(eventNgSelect.term);
  }
  onSubmit() {

    if (!this.formulaire.valid) {
      return false;
    } else {
      if (this.formulaire.value) {
        this.isLoadingResults = true;
        if (this.formulaire.value.id) {
          this.menuService.update(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults = false;
              this.openSnackBar(" Le menu utilisateur est modifié avec succès","OK");
              this.router.navigate([environment.FRONTEND_ROUTES.APP_MENU]);
            },
            errorResponse => {
              this.isLoadingResults = false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        }
       // console.log(this.formulaire.value);
      }
    }

  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  public  resetForm(){
    this.router.navigate([`${environment.FRONTEND_ROUTES.APP_MENU}`]);

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }
}

