import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TooltipComponent } from '../tooltip-component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-input-leverage',
  templateUrl: './input-leverage.component.html',
  styleUrls: ['./input-leverage.component.scss']
})
export class InputLeverageComponent extends TooltipComponent implements OnInit {

  @Output() value$ = new EventEmitter<number>();
  numberValue: number = 2;

  constructor(
    private sanitizer: DomSanitizer,
  ) { super(); }

  ngOnInit() { }

  setValue(value: number) {
    this.numberValue = value;
    this.value$.emit(value);
  }

  get positionOnScale() {
    const validValue = Math.min(
      Math.max(
        this.numberValue,
        1
      ),
      3
    );
    let position = Math.ceil(24 + (validValue - 1) * 275 / 1.7);
    if (position > 276) { position -= 14 + this.numberValue.toString().length * 9; }
    const positionOnScale = `left:${position}px`;
    return this.sanitizer.bypassSecurityTrustStyle(positionOnScale);
  }

}
