import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RemoteErrorMessageSnackbarComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<RemoteErrorMessageSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) { }

  ngAfterViewInit() {
    const type = this.data?.class || 'error';
    let color = '#e4aeae';
    if(type=='warning'){ color = '#f4ca23';}
    if(type=='info'){ color = '#f4ca23';}
    document.documentElement.style.setProperty('--dynamic-bg-color', color);
  }

}
