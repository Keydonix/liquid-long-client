import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TooltipComponent } from '../tooltip-component';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-input-quantity',
  templateUrl: './input-quantity.component.html',
  styleUrls: ['./input-quantity.component.scss']
})
export class InputQuantityComponent extends TooltipComponent implements OnInit {

  @Input() maxValue$: Observable<number>;
  @Output() value$ = new EventEmitter<number>();
  numberValue: number;
  minValue = environment.minQuantity;

  ngOnInit() { }

  setValue(value: number) {
    this.numberValue = value;
    this.value$.emit(value);
  }

}
