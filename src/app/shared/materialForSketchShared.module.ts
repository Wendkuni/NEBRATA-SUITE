
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonIndicatorSharedModule } from './material-modules/materialButtonIndicatorShared.module';
import { MatFormControlSharedModule } from './material-modules/materialFormControlShared.module';




@NgModule({
    declarations :[],
    imports : [
        MatButtonIndicatorSharedModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatToolbarModule,
        MatMenuModule,
        MatSidenavModule,
        MatFormControlSharedModule,
        MatBadgeModule

    ],
    exports:[
        MatButtonIndicatorSharedModule,
        MatFormControlSharedModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatToolbarModule,
        MatMenuModule,
        MatSidenavModule,
        MatBadgeModule
    ],

})
export class MatElementForSketchModule {

}