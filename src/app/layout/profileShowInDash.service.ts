
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private isProfileVisible = new BehaviorSubject<boolean>(false);
  isProfileVisible$ = this.isProfileVisible.asObservable();

  showProfile() {
    this.isProfileVisible.next(true);
  }

  hideProfile() {
    this.isProfileVisible.next(false);
  }

  toggleProfile() {
    const currentState = this.isProfileVisible.getValue();
    this.isProfileVisible.next(!currentState);
    
  }
}
