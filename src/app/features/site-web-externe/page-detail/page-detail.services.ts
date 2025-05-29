import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable()
export class PageDetailServices{
  url='';
  constructor(private http: HttpClient){}

  findAll(): Observable<any>{
    return this.http.get<any>(this.url);
  }
}

