import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Contact } from '@sycadApp/models/data-references/system/model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-info-user-emails',
  templateUrl: './info-user-emails.component.html',
  styleUrls: ['./info-user-emails.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InfoUserEmailsComponent implements OnInit {


  public principalEmail$:Observable<Contact>;

  constructor() { }

  @Input()
  public emails:any;



  ngOnInit(): void {
    this.getPrincipal(this?.emails);
  }

  private getPrincipal(emails){
    for (let index = 0; index < emails?.length; index++) {
      if(emails[index]?.principal === true) {
        this.principalEmail$ = of(emails[index]);
        break;
      }
    }
  }

}
