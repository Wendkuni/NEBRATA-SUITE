import { Injectable } from '@angular/core';



@Injectable({ providedIn: 'root' })
export class AutorisationService  { 
   private permissions = new Map<string, boolean>();

   public canI(key:string): boolean {

    if(this.permissions.has(key) && this.permissions.get(key)===true) {
       return true;
    }
    return false;
  }
 }