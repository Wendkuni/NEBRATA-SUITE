import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {DocumentType} from '@sycadApp/models/data-references/system/document-type.model';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class DocumentTypeService extends GenericDatasource<DocumentType, DocumentType, DocumentType> {

  constructor(public http: HttpClient)
  {
    super(http);
  }
 getUrl(): string {
   return environment.CONFIGURATION.TYPE_DOCUMENT_API;
 }
}
