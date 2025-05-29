import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { GenericDatasource } from "@sycadApp/models/generic-datasource";
import { environment } from "environments/environment";
import { Audit } from "@sycadApp/models/data-references/system/audit";

@Injectable()
export class AuditService extends GenericDatasource<Audit, Audit, Audit> {
  constructor(public http: HttpClient) {
    super(http);
  }
  getUrl(): string {
    return environment.APPLICATION.AUDIT;
  }
}
