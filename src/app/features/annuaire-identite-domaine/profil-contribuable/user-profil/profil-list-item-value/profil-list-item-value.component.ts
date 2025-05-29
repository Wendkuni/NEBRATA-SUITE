import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-profil-list-item-value',
  templateUrl: './profil-list-item-value.component.html',
  styleUrls: ['./profil-list-item-value.component.scss']
})
export class ProfilListItemValueComponent implements OnInit {

  @Input() value: string;
  @Input() tooltip: string = null;

  constructor() {}

  ngOnInit(): void {
    this.tooltip = this.tooltip === null ? this.value : this.tooltip;
  }

}
