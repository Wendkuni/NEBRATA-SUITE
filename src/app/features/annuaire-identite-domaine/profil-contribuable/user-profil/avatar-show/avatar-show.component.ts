import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-avatar-show",
  templateUrl: "./avatar-show.component.html",
  styleUrls: ["./avatar-show.component.scss"],
})
export class AvatarShowComponent implements OnInit {
  public activeIconAvatarEdition = false;

  @Input()
  public userOnline: any;

  @Input() readonly: boolean = false;

  @Output()
  private toggleAvatarEdition: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  openEdition() {
    if(this.readonly===true)
    return ;
    this.toggleAvatarEdition.emit();
  }
}
