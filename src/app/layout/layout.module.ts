import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PipesModule } from 'app/pipes/pipes.module';

import { FlagsMenuComponent } from '@sycadLayout/flags-menu/flags-menu.component';
import { FullScreenComponent } from '@sycadLayout/fullscreen/fullscreen.component';
import { ApplicationsComponent } from '@sycadLayout/applications/applications.component';
import { MessagesComponent } from '@sycadLayout/messages/messages.component';
import { UserMenuComponent } from '@sycadLayout/user-menu/user-menu.component';
import { BreadcrumbComponent } from '@sycadLayout/breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';
import { GeneralGlobalSharedModule } from '@sycadApp/shared/generalShared.module';
import { VerticalMenuComponent } from '@sycadLayout/menu/vertical-menu/vertical-menu.component';
import { HorizontalMenuComponent } from '@sycadLayout/menu/horizontal-menu/horizontal-menu.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNavigationSharedModule } from '@sycadApp/shared/material-modules/materialNavigationShared.module';
import { MatButtonIndicatorSharedModule } from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import { MatLayoutSharedModule } from '@sycadApp/shared/material-modules/materialLayoutShared.module';
import { MatPopupModalSharedModule } from '@sycadApp/shared/material-modules/materialPopupModalShared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppComfirmComponent } from '@sycadApp/shared/app-confirm/app-confirm.component';
import { RemoteErrorMessageSnackbarComponent } from '@sycadApp/shared/app-toast/snackbar.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ErrorComponent } from './error/error.component';




@NgModule({
  declarations: [
    RemoteErrorMessageSnackbarComponent,
    FlagsMenuComponent,
    FullScreenComponent,
    ApplicationsComponent,
    MessagesComponent,
    UserMenuComponent,
    BreadcrumbComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,   
    SidenavComponent,
    AppComfirmComponent,
    NotFoundComponent,
    ErrorComponent
    ],
  imports: [
    CommonModule,
    MatLayoutSharedModule,
    MatNavigationSharedModule,
    MatButtonIndicatorSharedModule,
    MatPopupModalSharedModule,   
    PipesModule,
    RouterModule,
    GeneralGlobalSharedModule,
    
  ],
  exports: [
    FlagsMenuComponent,
    FullScreenComponent,
    ApplicationsComponent,
    MessagesComponent,
    PipesModule,
    UserMenuComponent,
    BreadcrumbComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    SidenavComponent,
    AppComfirmComponent

  ]
})
export class LayoutModule { }
