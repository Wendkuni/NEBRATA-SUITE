import { Injectable } from "@angular/core";
import { HttpClient, HttpParams} from "@angular/common/http";
import { environment } from "environments/environment";
import { Transition } from '@sycadApp/models/workflow/common/general';

@Injectable()
export class TransitionService {
  constructor(public http: HttpClient) {
  }

  getTransitionOfDossier(codeTransition: string, numeroDossier: string) {
    return this.http.get<Transition>(`${environment.PROCESSUS.TRANSITION}/${numeroDossier}/${codeTransition}`);
  }

 
}