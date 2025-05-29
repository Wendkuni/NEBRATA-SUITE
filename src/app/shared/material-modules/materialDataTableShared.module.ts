import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
    declarations :[],
    imports : [
        MatPaginatorModule,
        MatSortModule,
        MatSelectModule,
        MatTableModule

    ],
    exports:[
        MatPaginatorModule,
        MatSortModule,
        MatSelectModule,
        MatTableModule
    ],

})
export class MatDataTableSharedModule {

}