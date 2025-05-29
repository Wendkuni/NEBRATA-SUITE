import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  suppressScrollX: true
};

import { FlexLayoutModule } from '@angular/flex-layout';

import { OverlayContainer } from '@angular/cdk/overlay';
import { CustomOverlayContainer } from '@sycadTheme/utils/custom-overlay-container';




import { PipesModule } from 'app/pipes/pipes.module';
import { ClickStopPropagation } from './directives/click-stop-propagation.directive';
import { ExportService } from '@sycadApp/shared/directives/export.service';
import { PrinterExportResourceDirective } from './directives/printer.export.ressource.directive';
import { AuthorisationDirective, ExportRessourceDirective } from './directives/export.ressource.directive';
import { AnimationCountDigitComponent } from '@sycadApp/shared/count-animation/animation.component';
import { ResizeColumnDirective } from './directives/resize-column-directive';
import { ActeurLogoPipe } from '@sycadApp/pipes/profilePicture/profilePicture.pipe';
import { MatBadgeModule } from '@angular/material/badge';

import { MatDataTableSharedModule } from './material-modules/materialDataTableShared.module';
import { RecaptchaV3Module, RECAPTCHA_SETTINGS, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';




@NgModule({
  declarations: [
    AuthorisationDirective, ClickStopPropagation,PrinterExportResourceDirective,ActeurLogoPipe,ExportRessourceDirective,AnimationCountDigitComponent,ResizeColumnDirective],
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    FlexLayoutModule,
    PipesModule,
    MatDataTableSharedModule,
    RecaptchaV3Module,
   /* ReCaptchaModule.forRoot({
      invisible: {
          sitekey: '6Lcw4xocAAAAACYfsiY0wq27FHDn_tMUfWNtpacR',
          badge:"bottomright"
      },
      normal: {
          sitekey: '6Lcw4xocAAAAACYfsiY0wq27FHDn_tMUfWNtpacR',
      },
      language: 'fr',

  }), */
  ],
  providers: [
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    { provide: OverlayContainer, useClass: CustomOverlayContainer },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: "6LdP9wUqAAAAAPt5uy2H73KZhPzHJ3FjVG8nLJV1" },
  //  { provide: RECAPTCHA_SETTINGS, useValue: {} }

  ],
  exports: [
    PerfectScrollbarModule,
    FlexLayoutModule,
    PipesModule,
    ActeurLogoPipe,
    ClickStopPropagation,
    PrinterExportResourceDirective,
    ExportRessourceDirective,
    AnimationCountDigitComponent,
    ResizeColumnDirective,
    AuthorisationDirective,
    RecaptchaV3Module



  ]
})
export class GeneralGlobalSharedModule { }
