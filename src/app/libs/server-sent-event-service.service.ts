import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerSentEventServiceService {
  public getEventSource(url:string): EventSource {
    return new EventSource(url,{withCredentials:true});
  }
}
