import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TooltipComponent } from '../tooltip-component';
import { mapTo } from 'rxjs/operators';
import { merge, Observable } from 'rxjs';


@Component({
  selector: 'app-confirm-panel',
  templateUrl: './confirm-panel.component.html',
  styleUrls: ['./confirm-panel.component.scss']
})
export class ConfirmPanelComponent extends TooltipComponent implements OnInit {

  @Input() totalPrice: number;
  @Input() leverageAmount: number;
  @Input() exchangeCost: number;
  @Input() serviceFee: number;
  @Input() confirm$: Observable<boolean>;
  @Output() submit$ = new EventEmitter<boolean>();
  isDisabled$: Observable<boolean>;

  ngOnInit() {
    this.isDisabled$ = merge(
      this.submit$.pipe(mapTo(true)),
      this.confirm$.pipe(mapTo(false)),
    );
    // TODO: merge(this.leverageAmount$.pipe(mapTo(false)), ...).pipe(startWith(true))
  }

}
