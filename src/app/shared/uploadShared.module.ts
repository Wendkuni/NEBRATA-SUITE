import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { environment } from 'environments/environment';


//https://www.dropzonejs.com/#configuration-options
const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  url: environment.APPLICATION.UPLOAD_FILE_API,
  withCredentials: true,
  paramName: "fichier",
  maxFilesize: 100, // MB
  acceptedFiles: 'image/*',
  createImageThumbnails: true,
  thumbnailHeight: 120,
  thumbnailWidth: 120
};

@NgModule({
  declarations: [
  ],
  imports: [
    DropzoneModule
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ],
  exports: [
    DropzoneModule
  ]
})
export class UploadSharedModule { }
