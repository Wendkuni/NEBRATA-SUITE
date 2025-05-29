import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralGlobalSharedModule } from '@sycadApp/shared/generalShared.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonIndicatorSharedModule } from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import { MatFormControlSharedModule } from '@sycadApp/shared/material-modules/materialFormControlShared.module';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPopupModalSharedModule } from '@sycadApp/shared/material-modules/materialPopupModalShared.module';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { FormRoleComponent } from './form-role/form-role.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';

import { RolesService } from '@sycadApp/services/data-references/security/roles-services';
import { PermissionService } from '@sycadApp/services/data-references/security/permissions-services';


@NgModule({
  declarations: [RolesComponent, FormRoleComponent],
  imports: [
    CommonModule,
    RolesRoutingModule,
    GeneralGlobalSharedModule,
    MatButtonIndicatorSharedModule,
    MatPopupModalSharedModule,
    MatFormControlSharedModule,
    MatNativeDateModule,
    MatDividerModule,
    MatMenuModule,
    MatCardModule,
    MatTabsModule,
    FormsModule,
    MatGridListModule,
    MatExpansionModule,
    ReactiveFormsModule,
    
  ],
  providers: [ RolesService,PermissionService] ,
  entryComponents:[
    FormRoleComponent
  ]
})
export class RolesModule { }
