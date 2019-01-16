import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { TooltipComponent } from '../tooltip-component';
import { skip } from 'rxjs/operators';


@Component({
  selector: 'app-input-fee',
  templateUrl: './input-cost.component.html',
  styleUrls: ['./input-cost.component.scss']
})
export class InputCostComponent extends TooltipComponent implements OnInit {

  @Input() exchangeCostRangeLimits$: Observable<{ low: number, high: number }>;
  @Input() leverage$: Observable<number>;
  @Input() quantity$: Observable<number>;
  @Output() value$ = new EventEmitter<number>();
  minExchangeCost: number = 0.01;
  maxExchangeCost: number = 0.05;
  selectedExchangeCost: number = 0.01;
  get numberValue() { return this.selectedExchangeCost - this.minExchangeCost; }
  get minValue() { return 0; }
  get maxValue() { return this.maxExchangeCost - this.minExchangeCost; }
  state: 'blank' | 'spinner' | 'input' = 'blank';

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
      // we round by getting the digit we care about into the 1s place, and then calling the rounding function, then adding an appropriate number of zeros back
      return roundingFunction(value * 10 ** leastSignificantFigure) * 10 ** (-leastSignificantFigure);
    }
    // only reachable if the value is _really_ close to 0
    return 0;
  }

  ngOnInit() {
    this.exchangeCostRangeLimits$.subscribe(({low, high}) => {
      this.minExchangeCost = InputCostComponent.toSignificantFigures(low, 2, Math.ceil);
      this.maxExchangeCost = InputCostComponent.toSignificantFigures(high, 2, Math.ceil);
      this.selectedExchangeCost = this.minExchangeCost;
      this.state = 'input';
      this.value$.emit(this.selectedExchangeCost);
    });
    combineLatest(this.leverage$, this.quantity$).subscribe(([leverage, quantity]) => this.state = (leverage && quantity) ? 'spinner' : 'blank')
  }

  setValue(value: number) {
    this.selectedExchangeCost = value + this.minExchangeCost;
    this.value$.emit(this.selectedExchangeCost);
  }

}
