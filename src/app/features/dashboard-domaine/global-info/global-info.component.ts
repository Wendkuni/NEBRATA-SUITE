import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { orders, products, customers, refunds } from '../dashboard.data';
import { Settings } from '@sycadApp/config/app.settings.model';
import { AppSettingsService } from '@sycadApp/config/app.settings.service';
  
@Component({
  selector: 'app-global-info',
  templateUrl: './global-info.component.html',
  styleUrls: ['./global-info.component.scss']
})
export class GlobalInfoComponent implements OnInit {

  public orders: any[];
  public products: any[];
  public customers: any[];
  public refunds: any[];
  public colorScheme = {
    domain: ['#999']
  }; 
  public autoScale = true;
  @ViewChild('resizedDiv') resizedDiv:ElementRef;
  public previousWidthOfResizedDiv:number = 0; 
  public settings: Settings;
  constructor(public appSettings:AppSettingsService){
    this.settings = this.appSettings.settings; 
  }

  ngOnInit(){
    this.orders = orders;
    this.products = products;
    this.customers = customers;
    this.refunds = refunds;
    this.orders = this.addRandomValue('orders');     
    this.customers = this.addRandomValue('customers');
  }
  
  public onSelect(event) {
    //console.log(event);
  }

  public addRandomValue(param) {
    switch(param) {
      case 'orders':
        for (let i = 1; i < 30; i++) { 
          this.orders[0].series.push({"name": 1980+i, "value": Math.ceil(Math.random() * 1000000)});
        } 
        return this.orders;
      case 'customers':
        for (let i = 1; i < 15; i++) { 
          this.customers[0].series.push({"name": 2000+i, "value": Math.ceil(Math.random() * 1000000)});
        } 
        return this.customers;
      default:
        return this.orders;
    }
  }

  ngOnDestroy(){
    this.orders[0].series.length = 0;
    this.customers[0].series.length = 0;
  }

  ngAfterViewChecked() {    
    if(this.previousWidthOfResizedDiv != this.resizedDiv.nativeElement.clientWidth){
      setTimeout(() => this.orders = [...orders] ); 
      setTimeout(() => this.products = [...products] ); 
      setTimeout(() => this.customers = [...customers] ); 
      setTimeout(() => this.refunds = [...refunds] );
    }
    this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
  }

}
