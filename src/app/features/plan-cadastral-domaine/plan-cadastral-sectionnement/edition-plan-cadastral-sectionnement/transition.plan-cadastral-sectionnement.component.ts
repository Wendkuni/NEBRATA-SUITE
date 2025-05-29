
import { Input, Directive } from '@angular/core';
import { PlanCadastralSectionnementElement } from '@sycadApp/models/workflow/common/sectionnement.model';
import { Validators, FormArray, FormBuilder } from '@angular/forms';
import { Processus, Transition } from '@sycadApp/models/workflow/common/general';
import { Section } from '@sycadApp/models/data-references/contribuables/global.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { DateAdapter } from '@angular/material/core';
import { MediaObserver } from '@angular/flex-layout';
import { TransitionPlanCadastralComponent } from '@sycadApp/shared/form-components/processus/transition.plan-cadastral.component';




@Directive()
export class TransitionPlanCadastralSectionnementComponent extends TransitionPlanCadastralComponent<PlanCadastralSectionnementElement> { 
   
    @Input()
  public planCadastral: PlanCadastralSectionnementElement;
  @Input()
  public transition: Transition;

  @Input()
  public processus: Processus;

  public isLoadingResults = false;
  
    get sections() { return this.formulaire.controls.sections as FormArray; }
      /**************** sections  *************  ********/
  
      createSection(section:Section=null) {

        if(section==null) {
          return this.fb.group({
            id: [null],
            numeroAncien: [null],
            numero: [null, Validators.compose([Validators.required])]
          });
        }else {
          return this.fb.group({
            id: [section.id],
            numeroAncien: [section.numeroAncien],
            numero: [section.numero, Validators.compose([Validators.required])]
          });
        }
       
      }
      addNewSection() {
        this.sections.insert(0, this.createSection());
  
      }
  
      constructor(
        public router: Router,
        public _snackBar: MatSnackBar,
        public confirmService: AppConfirmService,
        public _adapter: DateAdapter<any>,
        public mediaObserver: MediaObserver,
        public fb: FormBuilder
        ){
         super(router,_snackBar,confirmService,_adapter,mediaObserver,fb);

        }  
  
      removeSection(index) {

        this.sections.removeAt(index);
      
      }
      /**************** fin sections *********************/

    
}