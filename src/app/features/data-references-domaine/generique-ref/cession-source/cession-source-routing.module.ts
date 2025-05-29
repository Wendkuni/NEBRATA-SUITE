import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CessionSourceComponent } from './cession-source.component';


const routes: Routes = [{ path: '', component: CessionSourceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CessionSourceRoutingModule { }
