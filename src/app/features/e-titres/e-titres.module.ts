import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SdDelivranceAapModule } from './saisie-differee-delivrance-aap/sd-delivrance-aap.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SdDelivranceAapModule
  ],
  exports: [
    SdDelivranceAapModule
  ]
})
export class ETitresModule { }
