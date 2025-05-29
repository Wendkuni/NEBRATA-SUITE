import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';


import * as FileSaver from 'file-saver';
import { environment } from 'environments/environment';

import { TypeExportFile } from '@sycadApp/models/data-references/system/model';
import { SycadTableContext, MappingAPIParams } from '@sycadApp/libs/model-table';
import { MappingAPIParam } from '@sycadApp/models/generic-datasource';
  


export const getFileNameFromResponseContentDisposition = (res: HttpResponse<any>) => {
  const contentDisposition = res.headers.get('content-disposition') || '';
  const matches = /filename=([^;]+)/gi.exec(contentDisposition);
  const fileName = (matches[1] || 'untitled').trim();
  return fileName;
};

export class StatsExport {
  typeResource: string;
  typeExport: TypeExportFile;
  size: number;
  time: number;
  fileName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  public resourceUrl = environment.APPLICATION.EXPORT_API;

  public mapping : MappingAPIParams = MappingAPIParam();
  constructor(private http: HttpClient) {}

  public exportByType(typeResource: string, typeExport: TypeExportFile, contextFilter: SycadTableContext<any>, finishCallback: (StatsExport) => void) {
    const start = new Date().getTime();
    const headers = new HttpHeaders().set('Type-Report', typeExport.valueOf());
    let httpParams = contextFilter.getParams(this.mapping);      
    this.http
      .get(this.resourceUrl + '/' + typeResource, { headers, params:httpParams, observe: 'response', responseType: 'blob' as 'json' })
      .subscribe((response: any) => {
        const binaryData = [];
        binaryData.push(response.body);

        const fileName = getFileNameFromResponseContentDisposition(response);

        FileSaver.saveAs(new Blob(binaryData, { type: 'application/octet-stream;charset=utf-8' }), fileName);
        finishCallback({
          typeResource,
          typeExport,
          time: new Date().getTime() - start,
          size: response.body.size,
          fileName
        });
      });
  }

  public print(typeResource: string, contextFilter: SycadTableContext<any>) {
    
    let httpParams = contextFilter.getParams(this.mapping);          
    const headers = new HttpHeaders().set('Type-Report', "PDF");
    this.http
      .get(this.resourceUrl + '/' + typeResource, { headers, params:httpParams,observe: 'response', responseType: 'blob' as 'json' })
      .subscribe((response: any) => {
        const binaryData = [];
        binaryData.push(response.body);
        const blob = new Blob(binaryData, { type: 'application/pdf;charset=utf-8' });
        const fileName = getFileNameFromResponseContentDisposition(response);
        const objectURL = URL.createObjectURL(blob);
        const popup = window.open(
          '',
          fileName,
          "width=1024,height=768,resizable=yes,scrollbars=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,copyhistory=no,id='printPDF'"
        );
      
        popup.window.document.location.href = objectURL;
        window.setTimeout(function () {
          popup.window.print();
        }, 1000);
      });
  }

  public exportDocumentProcessus(numero: string, finishCallback: (StatsExport) => void) {
    const start = new Date().getTime();
    this.http
      .get(environment.APPLICATION.EXPORT_PROCESSUS_DOSSIER  + '/' + numero, { observe: 'response', responseType: 'blob' as 'json' })
      .subscribe((response: any) => {
        const binaryData = [];
        binaryData.push(response.body);

        const fileName = getFileNameFromResponseContentDisposition(response);

        FileSaver.saveAs(new Blob(binaryData, { type: 'application/octet-stream;charset=utf-8' }), fileName);
        finishCallback({
          typeResource:"PDF",
          time: new Date().getTime() - start,
          size: response.body.size,
          fileName
        });
      });
  }
}
