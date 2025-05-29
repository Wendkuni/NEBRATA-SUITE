import { Compiler, Component, ComponentFactory, Injector, NgModuleFactory, ViewContainerRef } from '@angular/core';
import { GenericAction, SycadTableMetaData } from '@sycadApp/libs/model-table';



export abstract class AbstractSycadTableComponent {

    public monTableau: SycadTableMetaData;
    public actions: GenericAction[] = [];

    public componentFactories: ComponentFactory<any>[];

    public abstract  loadComponent();
    public abstract getAnchor(): ViewContainerRef;

    public createComponent(factory: ComponentFactory<any>) {
        this.getAnchor().clear();
        this.getAnchor().createComponent(factory);
    }

}


