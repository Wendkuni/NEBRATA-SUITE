import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
//import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { NgSelectModule } from '@ng-select/ng-select';
//import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';



@NgModule({
    declarations: [],
    imports : [
        MatAutocompleteModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
    //    MatSelectModule, 
     //   NgxMatSelectSearchModule,
        NgSelectModule,
        MatSliderModule,
        MatSlideToggleModule
    ],
    exports: [ 
        MatAutocompleteModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
    //    MatSelectModule,
   //     NgxMatSelectSearchModule,
        NgSelectModule,
        MatSliderModule,
        MatSlideToggleModule
    ]
})
export class MatFormControlSharedModule {

}  