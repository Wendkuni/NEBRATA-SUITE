import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralGlobalSharedModule } from '@sycadApp/shared/generalShared.module';
import { MatButtonIndicatorSharedModule } from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import { MatFormControlSharedModule } from '@sycadApp/shared/material-modules/materialFormControlShared.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { UploadSharedModule } from '@sycadApp/shared/uploadShared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AutocompleteSycadTableComponent } from './autocomplete-sycad-table/autocomplete-sycad-table.component';
import { FieldRemoteAutocompleteComponent } from './field-remote-autocomplete.component';
import { ShowBooleanValueFilterAutocompletePipe, ShowColonneValueAutocompletePipe, FilterColonneAutocompletePipe, TransListColumnFilterAutocompletePipe, TransFormDisplayedColumnsAutocompletePipe } from './pipe-autocomplete';


@NgModule({
  declarations: [
    FieldRemoteAutocompleteComponent,
    AutocompleteSycadTableComponent,
    ShowBooleanValueFilterAutocompletePipe,
    ShowColonneValueAutocompletePipe,
    FilterColonneAutocompletePipe,
    TransListColumnFilterAutocompletePipe,
    TransFormDisplayedColumnsAutocompletePipe
  ],
  imports: [
    CommonModule,

    GeneralGlobalSharedModule,
    MatButtonIndicatorSharedModule,
    MatFormControlSharedModule,
    MatNativeDateModule,
    MatDividerModule,
    MatFormFieldModule,
    MatTooltipModule,
    //  MatListModule,
    MatSelectModule,
    MatInputModule,
    // MatMenuModule,
    MatCardModule,
    MatTabsModule,
    FormsModule,
    MatGridListModule,
    MatExpansionModule,
    UploadSharedModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    AngularEditorModule
  ],
  exports: [
    FieldRemoteAutocompleteComponent,
    AutocompleteSycadTableComponent,
    ShowBooleanValueFilterAutocompletePipe,
    ShowColonneValueAutocompletePipe,
    FilterColonneAutocompletePipe,
    TransListColumnFilterAutocompletePipe,
    TransFormDisplayedColumnsAutocompletePipe
  ]
})
export class RemoteAutocompeteModule { }
