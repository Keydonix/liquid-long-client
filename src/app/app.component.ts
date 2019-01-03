import { Component, ElementRef } from '@angular/core';
import { version as appVersion } from '../../package.json';
import { version as middlewareVersion } from '../../node_modules/@keydonix/liquid-long-client-library/package.json';


@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {

  constructor(public elementRef: ElementRef) {
    const native: HTMLElement = this.elementRef.nativeElement;
    native.setAttribute(`app-version`, appVersion);
    native.setAttribute(`middleware-version`, middlewareVersion);
  }

}
