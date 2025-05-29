import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { StatsExport, ExportService } from './export.service';

import { TypeExportFile } from '@sycadApp/models/data-references/system/model';
import { SycadTableContext } from '@sycadApp/libs/model-table';
import { AuthorisationService } from '@sycadApp/features/transverse/login/authorisation.service';
 
/*
function Required(target: object, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    get() {
      throw new Error(`Attribute ${propertyKey} is required`);
    },
    set(value) {
      Object.defineProperty(target, propertyKey, { value, writable: true, configurable: true });
    }
  });
}

*/



@Directive({
  selector: '[sycad-export-ressource]'
})

export class ExportRessourceDirective{
@Input()
  //@Required
private typeExport: TypeExportFile;

  @Input()
 // @Required
  private typeResource: string;

  @Input()
  //@Required
  private contextFilter: SycadTableContext<any>;
  

 @Output()
private finishExport: EventEmitter<StatsExport> = new EventEmitter<StatsExport>();

  constructor(el: ElementRef, renderer: Renderer2, protected exportService: ExportService) {}

  @HostListener('click')
  onClick() {
    this.exportService.exportByType(this.typeResource, this.typeExport,this.contextFilter, dataStats => {
      this.finishExport.emit(dataStats);
    });

    
  }

}







/**
 * 
 * *hasPermission="['can_write', 'can_read']"
*/


@Directive({
  selector: '[hasPermission]'
})

export class AuthorisationDirective implements OnInit{


  private permissions: String[]; 

  constructor(    
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef, 
    private authorisationService: AuthorisationService) {

    }

  @Input()
  set hasPermission(perm:String[]) {
    this.updateView(perm);
  }

  ngOnInit(): void {
     this.authorisationService.myRoles().subscribe((list) => {
      this.permissions=list;
     });
  }

  private updateView(perms:String[]) {

     let i=0;
     let trouve:boolean=false;
      while(i<perms.length && !trouve){
            trouve=this.permissions.indexOf(perms[i])>=0;
           i++;
      }

    if (trouve) {
      this.viewContainer.createEmbeddedView(this.templateRef);
  } else {
    this.viewContainer.clear();
  }
  }

}
