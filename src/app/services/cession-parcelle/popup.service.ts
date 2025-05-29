import { Injectable, Injector, ComponentRef, ApplicationRef, ComponentFactoryResolver } from '@angular/core';
import {
  ParcellePopupComponent
} from "@sycadShared/form-components/plan-cadastral/parcelle-popup/parcelle-popup.component";
@Injectable({
  providedIn: 'root'
})
export class PopupService {
  constructor(
    private injector: Injector,
    private applicationRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  createPopupContent(data: any): HTMLElement {
    // Créer une factory pour le composant
    const factory = this.componentFactoryResolver.resolveComponentFactory(ParcellePopupComponent);

    // Créer le composant avec le typage explicite
    const componentRef: ComponentRef<ParcellePopupComponent> = factory.create(this.injector);

    // Définir les données d'entrée du composant
    componentRef.instance.data = data;

    // Attacher le composant à l'application
    this.applicationRef.attachView(componentRef.hostView);

    // Déclencher la détection de changements
    componentRef.changeDetectorRef.detectChanges();

    // Obtenir l'élément DOM du composant
    const domElem = componentRef.location.nativeElement;

    // Gérer le nettoyage lorsque le popup est fermé
    componentRef.instance.destroyed.subscribe(() => {
      this.applicationRef.detachView(componentRef.hostView);
      componentRef.destroy();
    });

    return domElem;
  }
}
