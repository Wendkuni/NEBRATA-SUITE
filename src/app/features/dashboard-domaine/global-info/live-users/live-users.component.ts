import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RemoteDataServiceService } from './remote-data-service.service';

@Component({
  selector: 'app-live-users',
  templateUrl: './live-users.component.html',
  styleUrls: ['./live-users.component.scss'],
  providers: [
    RemoteDataServiceService
  ] 
})
export class LiveUsersComponent implements OnInit {


  public nombreUserOnline$: Observable<number>;
  constructor(public remoteDataService: RemoteDataServiceService) { }

  ngOnInit(): void {

    this.remoteDataService.getSingleton().subscribe(data => {
      this.nombreUserOnline$=of(data.nombreUserOnline)
    });

    
  }
  ngOnDestroy() {
    this.remoteDataService.close();
  }
}
