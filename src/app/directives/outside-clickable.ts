import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[outsideClickable]'
})
export class OutsideClickable {

  constructor(private elementRef: ElementRef<HTMLElement>) { }

  @Output('clickOutside') clickOutside: EventEmitter<MouseEvent> = new EventEmitter();

  @HostListener('document:click', ['$event']) onMouseEnter(mouseEvent: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(mouseEvent.target as HTMLElement);
    if (!clickedInside) {
      this.clickOutside.emit(mouseEvent);
    }
  }

}
