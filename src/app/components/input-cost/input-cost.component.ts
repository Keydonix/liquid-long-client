import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { TooltipComponent } from '../tooltip-component';


@Component({
  selector: 'app-input-fee',
  templateUrl: './input-cost.component.html',
  styleUrls: ['./input-cost.component.scss']
})
export class InputCostComponent extends TooltipComponent implements OnInit {

  @Input() exchangeCostRangeLimits$: Observable<{ low: number, high: number }>;
  @Output() value$ = new EventEmitter<number>();
  minValue = 0;
  maxValue = 250;
  numberValue: number;


  static toSignificantFigures(value: number, numberOfSignificantFigures: number, roundingFunction: (number) => number): number {
    // early return for 0
    if (value === 0) {
      return 0;
    }
    // find the first significant digit
    for (let i = 0; i < 100; ++i) {
      const mostSignificantFigure = i - 50;
      // this wasn't it, try the next one
      if (Math.floor(value * 10 ** mostSignificantFigure) === 0) {
        continue;
      }
      // we found the most significant digit, return `numberOfSignificantFigures` more figures after that (inclusive)
      const leastSignificantFigure = mostSignificantFigure + numberOfSignificantFigures - 1;
      // we round by getting the digit we care about into the 1s place, and then calling the rounding function,
      // then adding an appropriate number of zeros back
      return roundingFunction(value * 10 ** leastSignificantFigure) * 10 ** (-leastSignificantFigure);
    }
    // only reachable if the value is _really_ close to 0
    return 0;
  }

  ngOnInit() {
    this.exchangeCostRangeLimits$.subscribe(({low, high}) => {
      this.minValue = InputCostComponent.toSignificantFigures(low, 2, Math.ceil);
      this.maxValue = InputCostComponent.toSignificantFigures(high, 2, Math.ceil);
      this.value$.emit((this.minValue + this.maxValue) / 2);
    });
  }

  setValue(value: number) {
    this.numberValue = value;
    this.value$.emit(value);
  }

}
