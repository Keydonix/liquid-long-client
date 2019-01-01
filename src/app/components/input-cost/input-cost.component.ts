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

  static fixRounding(value: number, numberOfRepetitions = 3): number {
    const stringValue = value.toString();
    const pointPosition = stringValue.search(/\./);
    const repeatingPosition = stringValue.search( new RegExp(`(\\d)\\1{${numberOfRepetitions - 1},}`));
    if (pointPosition === -1 || repeatingPosition === -1) {   // if integer or there is no cyclic repetitions means no rounding error
      return value;
    }
    const fractionDigits = Math.max( repeatingPosition - pointPosition - 1, numberOfRepetitions);

    // incrementing the value ultimate digit;
    const newStringValue = value.toFixed(fractionDigits);
    const newValue = +newStringValue;
    if (newValue < value) {
      // incrementing the value ultimate digit
      const fixedValue = newStringValue.substring(0, newStringValue.length - 1) + (newStringValue.substr(-1) + 1);
      return +fixedValue;
    } else {
      return +value.toFixed(fractionDigits);
    }
  }

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
      // this.minValue = low;
      // this.maxValue = high;
      // this.minValue = InputCostComponent.toSignificantFigures(low, 2, Math.ceil);
      // this.maxValue = InputCostComponent.toSignificantFigures(high, 2, Math.ceil);
      this.minValue = InputCostComponent.fixRounding(low);
      this.maxValue = InputCostComponent.fixRounding(high);
      this.value$.emit((this.minValue + this.maxValue) / 2);
    });
  }

  setValue(value: number) {
    this.numberValue = value;
    this.value$.emit(value);
  }

}
