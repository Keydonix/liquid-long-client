import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToolTipComponent } from '../tool-tip-component';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-input-quantity',
  templateUrl: './input-quantity.component.html',
  styleUrls: ['./input-quantity.component.scss']
})
export class InputQuantityComponent extends ToolTipComponent implements OnInit {

  @Input() maxValue;
  @Output() value$ = new EventEmitter<number>();
  numberValue: number;
  minValue = environment.minQuantity;

  constructor() { super(); }

  ngOnInit() { }

  setValue(value: number) {
    this.numberValue = value;
    this.value$.emit(value);
  }

}
