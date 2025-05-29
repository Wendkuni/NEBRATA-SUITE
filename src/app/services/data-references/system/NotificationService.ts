import {Injectable} from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {Nationalite} from '@sycadApp/models/data-references/contribuables/global.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Notification} from '@sycadApp/models/data-references/system/model';

@Injectable()
export class NotifficationService extends GenericDatasource <Notification, Notification, Notification> {

  constructor(public http: HttpClient) {
    super(http)
  }
  getUrl(): string {
    return environment.APPLICATION.NOTIFICATION_API;
  }
}
