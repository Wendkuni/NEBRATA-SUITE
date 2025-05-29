import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-profil-list-item',
  templateUrl: './profil-list-item.component.html',
  styleUrls: ['./profil-list-item.component.scss']
})
export class ProfilListItemComponent implements OnInit {

  @Input() value: string;
  @Input() tooltip: string = null;
  @Input() label: string = '---';
  @Input() line: boolean = true;

  constructor() {}

  ngOnInit(): void {
    this.tooltip = this.tooltip === null ? this.value : this.tooltip;
  }

}
