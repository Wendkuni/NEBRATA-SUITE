import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentTypeComponent } from './document-type.component';
import { FormDocumentTypeComponent } from './form-document-type/form-document-type.component';
import { DocumentTypeResolver } from './document-type-resolver';

const routes: Routes = [
  { path: '', component: DocumentTypeComponent },
  { path: "edition", component: FormDocumentTypeComponent},
  { path: "edition/:id", component: FormDocumentTypeComponent, resolve: { processus: DocumentTypeResolver}, data: {breadcrumb: "edition"}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentTypeRoutingModule { }
