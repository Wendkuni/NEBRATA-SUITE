import { Directive, HostListener, Input, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { ExportService } from './export.service';
import { SycadTableContext } from '@sycadApp/libs/model-table';


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
  selector: '[sycad-printer-export-resource]'
})
export class PrinterExportResourceDirective {
  @Input()
  //@Required
  private typeResource: string;


  @Input()
  // @Required
   private contextFilter: SycadTableContext<any>;

   
  constructor(el: ElementRef, renderer: Renderer2, protected exportService: ExportService) {}

  @HostListener('click')
  onClick() {
    this.exportService.print(this.typeResource,this.contextFilter);
  }
}
