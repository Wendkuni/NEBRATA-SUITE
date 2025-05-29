import { ProfilesRoutingModule } from './profiles-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilesComponent } from './profiles.component';
import { FormProfilesComponent } from './form-profiles/form-profiles.component';
import { GeneralGlobalSharedModule } from '@sycadApp/shared/generalShared.module';
import { MatButtonIndicatorSharedModule } from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import { MatPopupModalSharedModule } from '@sycadApp/shared/material-modules/materialPopupModalShared.module';
import { MatFormControlSharedModule } from '@sycadApp/shared/material-modules/materialFormControlShared.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { RolesService } from '@sycadApp/services/data-references/security/roles-services';
import { PermissionService } from '@sycadApp/services/data-references/security/permissions-services';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ProfilesService } from '@sycadApp/services/data-references/security/profiles.service';
import { ProfileResolver } from './profile-resolver';
import { MatDataTableSharedModule } from '@sycadApp/shared/material-modules/materialDataTableShared.module';



@NgModule({
  declarations: [ProfilesComponent, FormProfilesComponent],
  imports: [
    CommonModule,
    ProfilesRoutingModule,
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
    MatDataTableSharedModule,
    ScrollingModule,
    MatSelectModule,
    MatTooltipModule
  ],
  providers : [ProfilesService, RolesService, PermissionService,ProfileResolver],
  entryComponents: [FormProfilesComponent]
})
export class ProfilesModule { }
