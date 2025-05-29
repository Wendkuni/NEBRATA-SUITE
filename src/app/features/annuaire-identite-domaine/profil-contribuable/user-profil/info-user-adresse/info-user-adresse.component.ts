import { Component, OnInit, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Contact } from '@sycadApp/models/data-references/system/model';

@Component({
  selector: 'app-info-user-adresse',
  templateUrl: './info-user-adresse.component.html',
  styleUrls: ['./info-user-adresse.component.scss']
})
export class InfoUserAdresseComponent implements OnInit {



  public principalAdresse$:Observable<Contact>;

  @Input()
  public adresses:any;


  constructor() { }



  ngOnInit(): void {
    this.getPrincipal(this.adresses);
  
  }

  private getPrincipal(adresses){
    for (let index = 0; index < adresses?.length; index++) {
      if(adresses[index]?.principal === true) {
        this.principalAdresse$ = of(adresses[index]);
      //  this.principalAdresse$.subscribe(resp=>console.log(resp));
        break;
      }
    }
  }

}
