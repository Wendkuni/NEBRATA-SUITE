
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

import { Injectable, NgZone } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ServerSentEventServiceService } from '@sycadApp/libs/server-sent-event-service.service';
import { Notification } from '@sycadApp/models/data-references/system/model';


@Injectable({ providedIn: 'root' })
export class RemoteDataServiceService {
  private url:string=environment.REAL_TIME.GLOBAL_INFO;
   private eventSource: EventSource;

   public singleton: Subject<GlobalSessionInfo> = new Subject<GlobalSessionInfo>();

   get eventSourceInstance() {
     return this.eventSource;
   }
   public close():void{
    // console.log("clone event source")
    this.eventSource.close();
   }



  constructor(private _zone: NgZone, private sseService: ServerSentEventServiceService) {
console.log("new instace")
    this.eventSource = this.sseService.getEventSource(this.url);

    this.eventSource.onmessage = event => {
        this._zone.run(() => {
          let dto = JSON.parse(event.data);
          this.singleton.next(dto);
        });
      };
      this.eventSource.onerror = error => {
        this._zone.run(() => {
          this.singleton.error(error);
        });
      };
  }

  getSingleton():Subject<GlobalSessionInfo> {
    return this.singleton;
  }
 /* getLiveUsersSSE(): Observable<GlobalSessionInfo> {
    
    return Observable.create(observer => {
      this.eventSource = this.sseService.getEventSource(this.url);
 
      this.eventSource.onmessage = event => {
        this._zone.run(() => {
          let dto = JSON.parse(event.data);
          observer.next(dto);
          this.singleton.next(dto);
        });
      };
      this.eventSource.onerror = error => {
        this._zone.run(() => {
          observer.error(error);
          this.singleton.error(error);
        });
      };
    });
  }

  */
}


export class GlobalSessionInfo {
  nombreUserOnline: number;
  diligenceDossier: Notification[];
}