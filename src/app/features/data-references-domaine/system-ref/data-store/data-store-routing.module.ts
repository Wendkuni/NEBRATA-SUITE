import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataStoreComponent } from './data-store.component';

const routes: Routes = [{ path: '', component: DataStoreComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataStoreRoutingModule { }
