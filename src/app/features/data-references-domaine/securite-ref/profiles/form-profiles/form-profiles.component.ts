
import {MatSnackBar} from '@angular/material/snack-bar';

import { RoleItem, RoleElement, RoleAutocomplete } from '@sycadApp/models/data-references/security/role.model';
import { SycadTableContext } from '@sycadApp/libs/model-table';
import { ProfilElement, ProfilItem } from '@sycadApp/models/data-references/security/profil.model';
import { RolesService } from '@sycadApp/services/data-references/security/roles-services';
import { ProfilesService } from '@sycadApp/services/data-references/security/profiles.service';
import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PermissionService } from '@sycadApp/services/data-references/security/permissions-services';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { Permission } from '@sycadApp/models/data-references/security/permission.model';
import {of, Subject} from 'rxjs';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import {MediaChange, MediaObserver} from "@angular/flex-layout";

@Component({
  selector: 'app-form-profiles',
  templateUrl: './form-profiles.component.html',
  styleUrls: ['./form-profiles.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormProfilesComponent implements OnInit {
  isLoadingResults = false;
  public formulaire: FormGroup;
  isActive= false;
  private _onDestroy = new Subject<void>();
  public profile: ProfilElement;

  public permissionsRemoteAutocomplete = new RemoteAutocomplete<Permission>();
  public excludesRemoteAutocomplete = new RemoteAutocomplete<Permission>();
  public roleRemoteAutocomplete = new RemoteAutocomplete<RoleAutocomplete>();

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  get libelle() { return this.formulaire.get('libelle'); }
  get type() { return this.formulaire.get('type'); }
  get permissions() { return this.formulaire.get('permissions'); }
  get roles() { return this.formulaire.get('roles'); }
  get excludes() { return this.formulaire.get('excludes'); }
  types = [
    'AGENT',
    'ACTEURCATEGORIE'
  ];
 
  constructor(private roleService: RolesService,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver,
              private profileService: ProfilesService,
              public permissionService: PermissionService,
              private route: ActivatedRoute,
              private router: Router){
                this.profile=this.route.snapshot.data["profile"];
                  this.formulaire = this.fb.group({
                    id: null,
                    libelle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
                    type: [null, Validators.compose([Validators.required])],
                    permissions: [null],
                    roles: [null],
                    excludes: [null]
                  });
              }

  ngOnInit(): void {
    this.permissionsRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.permissionService);
    this.excludesRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.permissionService);
    this.roleRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.roleService);

    if(this.profile){

      if(this.profile.roles){
        this.roleRemoteAutocomplete.listRessource$=of(this.profile.roles);
        this.roleRemoteAutocomplete.initialList=this.profile.roles;
        this.dataSourceRoles = this.profile.roles;
      }
      if(this.profile.permissions){
        this.permissionsRemoteAutocomplete.listRessource$=of(this.profile.permissions);
        this.permissionsRemoteAutocomplete.initialList=this.profile.permissions;
      }
      if(this.profile.excludes){
        this.excludesRemoteAutocomplete.listRessource$=of(this.profile.excludes);
        this.excludesRemoteAutocomplete.initialList=this.profile.excludes;
      }
          this.formulaire.patchValue({
           id: this.profile.id,
           libelle: this.profile.libelle,
           type: this.profile.type,
           permissions: this.profile.permissions.map(perm => perm.id),
           excludes: this.profile.excludes.map(perm=>perm.id),
           roles: this.profile.roles.map(role => role.id)
         });
    }else {
      this.profile = new ProfilElement();
    }
  }


  public onSearchExlucision(eventNgSelect) {
    this.excludesRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  annuler()
  {
    this.router.navigate([environment.FRONTEND_ROUTES.SECURITY_PROFILE]);
  }

  public onSearchPermission(eventNgSelect) {
    this.permissionsRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchRole(eventNgSelect){
    this.roleRemoteAutocomplete.term.next(eventNgSelect.term);
  }




    openSnackBar(message: string, action: string) {
      this._snackBar.open(message, action, {
        duration: 25000,
        verticalPosition:'top'

      });
    }



    public onSubmit(){
      if (!this.formulaire.valid) {
        return false;
      }else{
        if(this.formulaire.value){
          this.isLoadingResults=true;
          if(this.formulaire.value.id){
            this.profileService.update(this.formulaire.value).subscribe(
              (data) => {
                this.isLoadingResults = false;
                this.openSnackBar("Profile modifié avec succès","OK");
                this.router.navigate([environment.FRONTEND_ROUTES.SECURITY_PROFILE]);
              },
              (error : HttpErrorResponse) => {
                this.isLoadingResults = false;
                this.openSnackBar("Impossible de modifier ce profile","OK");
              }
            );
          }
          else{
            this.profileService.add(this.formulaire.value).subscribe(
              (data) => {
                this.isLoadingResults = false;
                this.openSnackBar("Profile est ajouté avec succès","OK");
                this.router.navigate([environment.FRONTEND_ROUTES.SECURITY_PROFILE]);
              },
              (error : HttpErrorResponse) => {
                this.isLoadingResults = false;
                this.openSnackBar("Impossible d'ajouter le profile","OK");
              }
            )
          }
        }

      }
    }
    public displayedColumnsRoles: string[] = ['libelle'];
    public dataSourceRoles = [];

    public onChangeRole(roles){
      this.dataSourceRoles=roles;
    }
  }  

      



