import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-profil-list-item-icon',
  templateUrl: './profil-list-item-icon.component.html',
  styleUrls: ['./profil-list-item-icon.component.scss']
})
export class ProfilListItemIconComponent implements OnInit {

  @Input() value: string = null;
  @Input() tooltip: string = null;
  @Input() label: string = '---';
  @Input() icon: string = 'brightness_1';


  constructor() { }

  ngOnInit(): void {
    this.tooltip = this.tooltip === null ? this.value : this.tooltip;
  }

}
