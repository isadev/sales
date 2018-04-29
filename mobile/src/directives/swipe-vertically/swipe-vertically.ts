import { EventEmitter, Output, Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Events, Gesture } from 'ionic-angular';
declare var Hammer: any;

@Directive({
  selector: '[swipe-vertically]' // Attribute selector
})
export class SwipeVerticallyDirective implements OnInit, OnDestroy {
  @Output() onSwipeUp = new EventEmitter();
  @Output() onSwipeDown = new EventEmitter();

  private el: HTMLElement;
  private swipeGesture: Gesture;

  constructor(el: ElementRef, public events: Events) {
    this.el = el.nativeElement;
    this.events = events;
  }

  ngOnInit() {
    this.swipeGesture = new Gesture(this.el, {
      recognizers: [
        [Hammer.Swipe, { direction: Hammer.DIRECTION_ALL }] //precaucion aca por si esta detectando los movimientos tambien horizontales
      ]
    });
    this.swipeGesture.listen();
    this.swipeGesture.on('swipeup', e => {

      this.onSwipeUp.emit({ el: this.el, es2:"123" });
    });
    this.swipeGesture.on('swipedown', e => {

      this.onSwipeDown.emit({ el: this.el });
    });
  }

  ngOnDestroy() {
    this.swipeGesture.destroy();
  }
}
