import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { GenericDatasource } from "@sycadApp/models/generic-datasource";
import { environment } from "environments/environment";
import { TemplateEmail } from "@sycadApp/models/data-references/system/template-email";

@Injectable()
export class TemplateEmailService extends GenericDatasource<
  TemplateEmail,
  TemplateEmail,
  TemplateEmail
> {
  constructor(public http: HttpClient) {
    super(http);
  }
  getUrl(): string {
    return environment.APPLICATION.TEMPLATE_EMAIL_API;
  }
}
