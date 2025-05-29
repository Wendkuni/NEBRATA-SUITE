import { Component, OnInit, ViewChild, Inject, Output } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageCroppedEvent, ImageCropperComponent, base64ToFile } from 'ngx-image-cropper';

@Component({
  selector: 'app-cropper-avatar',
  templateUrl: './cropper-avatar.component.html',
  styleUrls: ['./cropper-avatar.component.scss']
})  
export class CropperAvatarComponent implements OnInit{

  @ViewChild("imageCroppedElement", { static: true }) 
  imageCroppedElement: ImageCropperComponent;
  public imageFile: any;
  public croppedImage: any = '';
  public done;
  public imageOnProcessus;
 
  public isLoadingResults:Boolean = false;

  constructor(public dialogRef: MatDialogRef<CropperAvatarComponent>, @Inject(MAT_DIALOG_DATA) public data: any){
  
      this.imageFile= data.file;
      this.done= data.done;
      this.imageOnProcessus= data.imageOnProcessus;

 
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      });
  
  }

  ngOnInit(): void {
   
 

  }
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      this.done(base64ToFile(event.base64));
   
   
  }
  cropeImage() {
    this.imageOnProcessus();
    this.imageCroppedElement.crop();


  }
  imageLoaded() {

  }

  loadImageFailed() {

  }

  closeAvatarEditor(): void {
    this.dialogRef.close();
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    });
  }

}
