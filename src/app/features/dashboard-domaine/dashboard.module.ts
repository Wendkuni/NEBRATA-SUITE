import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GeneralGlobalSharedModule } from '@sycadApp/shared/generalShared.module';
import { LayoutModule } from '@angular/cdk/layout';
import { MatCardModule } from '@angular/material/card';

import { MatButtonIndicatorSharedModule } from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';

import { GlobalInfoComponent } from './global-info/global-info.component';
import { LiveUsersComponent } from './global-info/live-users/live-users.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatLayoutSharedModule} from '@sycadApp/shared/material-modules/materialLayoutShared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { Vue360Component } from './vue360/vue360.component';





const routes: Routes = [
  { path: '', component: Vue360Component}
];

@NgModule({
  declarations: [Vue360Component, LiveUsersComponent, GlobalInfoComponent],
  imports: [
    CommonModule,
    NgxChartsModule,
    GeneralGlobalSharedModule,
    MatCardModule,
    MatButtonIndicatorSharedModule,
    LayoutModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatLayoutSharedModule,
    ReactiveFormsModule,
    MatInputModule
  ]
})
export class DashboardModule { }
