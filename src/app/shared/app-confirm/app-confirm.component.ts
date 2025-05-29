
import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './app-confirm.component.html',
  styleUrls: ['./app-confirm.component.scss']
})
export class AppComfirmComponent {
  constructor(public dialogRef: MatDialogRef<AppComfirmComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
}
 