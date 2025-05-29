import { Component, OnInit, Input } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Contact } from '@sycadApp/models/data-references/system/model';

@Component({
  selector: 'app-info-user-telephone',
  templateUrl: './info-user-telephone.component.html',
  styleUrls: ['./info-user-telephone.component.scss']
})
export class InfoUserTelephoneComponent implements OnInit {

  public principalTelephone$:Observable<Contact>;

  @Input()
  public telephones: any;

  constructor() { }

  ngOnInit(): void {
    this.getPrincipal(this.telephones);
   
  }

  private getPrincipal(telephones){
    for(let index = 0 ; index < telephones?.length ; index++) {
      if(telephones[index]?.principal === true) {
        this.principalTelephone$ = of(telephones[index]);
        break;
      }
    }
  }
}
