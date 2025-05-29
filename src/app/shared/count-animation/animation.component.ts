import { animate, style, transition, trigger } from "@angular/animations";
import {
    Component,
    ElementRef,
    Input,
    AfterViewInit,
    ViewChild,
    OnChanges,
    SimpleChanges
  } from "@angular/core";
  
  @Component({
    selector: "animation-count-digit",
    templateUrl: "animation-count-digit.component.html",
    styleUrls: ["animation-count-digit.component.scss"]
  })
  export class AnimationCountDigitComponent implements AfterViewInit, OnChanges {
    @Input() duration: number;
    @Input() digit: number;
    @Input() steps: number;
    @ViewChild("animationDigit", { static: true }) animatedDigit: ElementRef;
    private lastDigit=0;
  
    animateCount() {
      if (!this.duration) {
        this.duration = 1000;
      }
  
      if (typeof this.digit === "number") {
        this.counterFunc(this.digit, this.duration, this.animatedDigit);
      }
    }
  
    counterFunc(endValue, durationMs, element) {

      let lastDigit = this.lastDigit;
      function animateValue() {
        let startTimestamp = null;
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
          element.nativeElement.textContent= Math.floor(progress * (endValue - lastDigit) + lastDigit);
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
      }
  
      animateValue();
      this.lastDigit=endValue;

    }
  
    ngAfterViewInit() {
      this.lastDigit=this.digit;
      if (this.digit) {
        this.animateCount();
      }
    }
  
    ngOnChanges(changes: SimpleChanges) {
      if (changes["digit"]) {
       this.animateCount();
      }
    }
  }
  

 