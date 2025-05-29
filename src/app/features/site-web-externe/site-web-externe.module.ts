import { PageDetailResolve } from './page-detail/page-detail.resolve';
import { PageDetailServices } from './page-detail/page-detail.services';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SiteWebExterneRoutingModule } from './site-web-externe-routing.module';
import { SiteWebExterneComponent } from './site-web-externe.component';
import { PageDetailComponent } from './page-detail/page-detail.component';
import { MatFormControlSharedModule } from '@sycadApp/shared/material-modules/materialFormControlShared.module';
import { MatButtonIndicatorSharedModule } from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TextMaskModule } from 'angular2-text-mask';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { HeaderLandingComponent } from './header-landing/header-landing.component';
import { ModelVoirPlusComponent } from './model-voir-plus/model-voir-plus.component';


@NgModule({
  declarations: [
    SiteWebExterneComponent,
    PageDetailComponent,
    HeaderLandingComponent,
    ModelVoirPlusComponent,
  ],
  imports: [
    CommonModule,
    SiteWebExterneRoutingModule,
    FlexLayoutModule,
    MatFormControlSharedModule,
    MatButtonIndicatorSharedModule,
    MatCardModule,
    MatSidenavModule,
    TextMaskModule,
    MatListModule,
    MatExpansionModule,
    MatGridListModule
  ],
  providers:[
    PageDetailServices,
    PageDetailResolve
  ]
})
export class SiteWebExterneModule { }
