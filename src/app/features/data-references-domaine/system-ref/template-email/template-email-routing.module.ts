import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FormTemplateEmailComponent } from "./form-template-email/form-template-email.component";
import { TemplateEmailResolver } from "./template-email-resolver";

import { TemplateEmailComponent } from "./template-email.component";

const routes: Routes = [{ path: "", component: TemplateEmailComponent },
 {path: "edition/:id", component: FormTemplateEmailComponent,
 resolve: {templateEmail: TemplateEmailResolver},
 data: {breadcrumb: 'edition'}}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplateEmailRoutingModule {}
