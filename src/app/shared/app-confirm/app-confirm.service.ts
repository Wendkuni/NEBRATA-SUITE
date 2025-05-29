import { Observable } from 'rxjs';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Injectable } from '@angular/core';

import { AppComfirmComponent } from './app-confirm.component';

interface confirmData {
  title?: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AppConfirmService {
  constructor(private dialog: MatDialog) {}

  public confirm(data: confirmData = {}): Observable<boolean> {
    data.title = data.title || 'Confirmation';
    data.message = data.message || `Voulez vous confirmer l'action suivante ?`;
    let dialogRef: MatDialogRef<AppComfirmComponent>;
    dialogRef = this.dialog.open(AppComfirmComponent, {
      maxWidth: '50vw',
      position: {
        top:"7vw"
      },
      disableClose: true,
      data: { title: data.title, message: data.message }
    });
    return dialogRef.afterClosed();
  }
}
