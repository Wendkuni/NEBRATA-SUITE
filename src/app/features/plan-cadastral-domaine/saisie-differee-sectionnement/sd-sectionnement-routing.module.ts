import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  SdSectionnementComponent
} from "@sycadFeature/plan-cadastral-domaine/saisie-differee-sectionnement/sd-sectionnement.component";
import {
  EditionSdSectionnementComponent
} from "@sycadFeature/plan-cadastral-domaine/saisie-differee-sectionnement/edition-sectionnement/edition-sd-sectionnement.component";
import {
  SdSectionnementProcessusResolver,
  SdSectionnementResolver,
  SdSectionnementTransitionResolver
} from "@sycadFeature/plan-cadastral-domaine/saisie-differee-sectionnement/sd-sectionnement-resolver";
import {
  VueSdSectionnementComponent
} from "@sycadFeature/plan-cadastral-domaine/saisie-differee-sectionnement/vue-sd-sectionnement/vue-sd-sectionnement.component";

const routes: Routes = [
  {path: '', component: SdSectionnementComponent },
  {path: 'edition', component: EditionSdSectionnementComponent, resolve: {processus: SdSectionnementProcessusResolver}},

  {path: 'edition/:numero/:transition', component: EditionSdSectionnementComponent,
    resolve: {sdSectionnement: SdSectionnementResolver,
      transition: SdSectionnementTransitionResolver, processus: SdSectionnementProcessusResolver }},
  {path: 'view/:numero', component: VueSdSectionnementComponent,
    resolve: {sdSectionnement: SdSectionnementResolver}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SdSectionnementRoutingModule { }
