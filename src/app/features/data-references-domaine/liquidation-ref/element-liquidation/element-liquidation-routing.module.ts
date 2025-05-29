import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ElementLiquidationComponent } from './element-liquidation.component';

const routes: Routes = [{ path: '', component: ElementLiquidationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElementLiquidationRoutingModule { }
