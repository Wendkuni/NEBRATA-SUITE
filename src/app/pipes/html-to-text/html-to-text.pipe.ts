import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'htmlToText',
  pure: true, // Permet de ne pas recalculer à chaque changement détecté
})
export class HtmlToTextPipe implements PipeTransform {
  transform(value: string): HTMLElement | null {
    if (!value) {
      return null;
    }

    // Crée un élément DOM en toute sécurité
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = value.trim();

    // Retourne le premier enfant comme HTMLElement
    return tempDiv.firstElementChild as HTMLElement;
  }
}
