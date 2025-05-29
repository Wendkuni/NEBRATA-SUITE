import { Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { DropzoneComponent, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CropperAvatarComponent } from '../cropper-avatar/cropper-avatar.component';
import { AvatarEditionFormData, UserProfilService } from '@sycadApp/services/data-references/system/user-profil.service';

import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { MatSnackBar } from '@angular/material/snack-bar';
  
 
@Component({
  selector: 'app-avatar-edition',
  templateUrl: './avatar-edition.component.html',
  styleUrls: ['./avatar-edition.component.scss']
})
export class AvatarEditionComponent implements OnInit {

 @Output()
 private finishAvatarUpdate: EventEmitter<string> = new EventEmitter<string>();

 @Output()
 private toggleAvatarEdition: EventEmitter<any> = new EventEmitter<any>();
 
 private  dialogRef:MatDialogRef<CropperAvatarComponent, any>;

  @ViewChild("dropzoneAvatar", { static: false }) 
  dropzoneComponentRef?: DropzoneComponent;

  public isLoadingResults:Boolean = false;

  imageOnProcessus(){
      this.isLoadingResults=true;
    }

  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    acceptedFiles: "image/*",
    capture: "image/*",
    resizeWidth :200,
    resizeHeight :200,
    transformFile: (file, done) => {

      this.imageOnProcessus();
      this.dialogRef = this.dialog.open(CropperAvatarComponent, {
        data: {
          file:file,
          done:done,
          imageOnProcessus:this.imageOnProcessus,
        },
        width: '35vw',
        maxWidth: '35vw',
        height: '30vw',
        position: {
          top:'2vw'
        }
      });

      this.dialogRef.afterClosed().subscribe(data => {
      this.dropzoneComponentRef.directiveRef.dropzone().removeAllFiles(true);
      });
    }
  };

    
  
  constructor(  public fb: FormBuilder,  
     public dialog: MatDialog, 
     public userProfilService: UserProfilService,
     private _snackBar: MatSnackBar) { 

  }
  ngAfterViewInit() {
    
  }
  ngOnInit(): void {

  }

  public onUploadError(args: any): void {
    this.resetAvatar();
   }
 
   public onUploadSuccess(remoteResponse): void {
     let fileName=remoteResponse[1].name;
     
     this.dialogRef.close();

 

     let formData= new AvatarEditionFormData(fileName);
     this.userProfilService.updateAvatar(formData).subscribe(
      data => {
     this.finishAvatarUpdate.emit(data.avatar);
         this.isLoadingResults=false;
      },
      errorResponse => {
          this.isLoadingResults=false;
        let dataError = {
          message:"La photo de profile n'a pas pu être modifiée"
        }
        SycadUtils.notifyRemoteError(dataError, this._snackBar);
      }
      );

  
   }
 
   public resetAvatar(): void {
     this.dropzoneComponentRef.directiveRef.reset();
   }

   closeEdition() {
    this.toggleAvatarEdition.emit();
  }


/*
  @HostLconsole.logistener('document:click')
  clickout() {
    if (!this.wasInside) {
      ("clicked outside");
    }
    //this.wasInside = false;
  }

  */

  private nbOpen=0;
 onClickedOutside(e: MouseEvent) {
  if(this.nbOpen>0 && e.screenX>0 && e.screenX>0 && e.clientX>0 && e.clientY >0) {
    this.toggleAvatarEdition.emit();
    this.nbOpen++;
  }
}
}
  