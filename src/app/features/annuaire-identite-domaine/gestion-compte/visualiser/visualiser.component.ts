import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CompteElement } from '@sycadApp/models/data-references/contribuables/compte.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-visualiser-user',
  templateUrl: './visualiser.component.html',
  styleUrls: ['./visualiser.component.scss']
})
export class VisualiserComponent implements OnInit {
  @Input()
  public noOpenActions: boolean=false;
  
public compteContribuable: CompteElement;
public typeCompte: string;

  constructor(private cd: ChangeDetectorRef,
    public route: ActivatedRoute,
    public router: Router,
    public _adapter: DateAdapter<any>) 
    {
      this.compteContribuable = this.route.snapshot.data["compteContribuable"]; 
     }

     get urlAction(){
      return `${environment.FRONTEND_ROUTES.GESTION_COMPTE }/edition`;
    }

  ngOnInit(): void {
    this._adapter.setLocale("fr");

    //console.log(this.compte);

    
  }

}
