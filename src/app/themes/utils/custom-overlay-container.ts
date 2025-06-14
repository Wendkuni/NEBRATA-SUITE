import { Injectable } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Injectable() 
export class CustomOverlayContainer extends OverlayContainer {
  _createContainer(): void {
    let container = document.createElement('div');
    container.classList.add('cdk-overlay-container');
    document.getElementById('sycad-app').appendChild(container);
    this._containerElement = container;
  }
}