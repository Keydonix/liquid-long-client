import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ToolTipComponent } from '../tool-tip-component';
import { MiddlewareService } from '../../services/middleware/middleware.service';
import { combineLatest, Observable, fromEvent, merge } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss']
})
export class InfoPanelComponent extends ToolTipComponent implements OnInit {

  @Input() leverage$: Observable<number>;
  @Input() quantity$: Observable<number>;
  @Input() price$: Observable<number>;
  @ViewChild('gradient') gradient: ElementRef<HTMLDivElement>;
  @ViewChild('priceLine') priceLine: ElementRef<HTMLDivElement>;
  @ViewChild('dashedLine') dashedLine: ElementRef<HTMLDivElement>;
  @ViewChild('dottedLine') dottedLine: ElementRef<HTMLDivElement>;
  @ViewChild('toolTipBox') toolTipBox: ElementRef<HTMLDivElement>;
  @ViewChild('bottomLineText') bottomLineText: ElementRef<HTMLDivElement>;
  isHideDetails = true;
  isShowDetails = false;
  isMouseInChart = false;

  liquidationPrice$: Observable<number>;
  liquidationLossPercentage$: Observable<number>;
  portfolioValue$: Observable<number>;
  priceToGain100$: Observable<number>;
  priceToGain50$: Observable<number>;
  priceToGain0$: Observable<number>;
  priceToLose50$: Observable<number>;
  maxLossPercentage$: Observable<number>;
  priceAtCursor$: Observable<number>;
  portfolioValueAtCursor$: Observable<number>;

  constructor(
    private middleware: MiddlewareService,
  ) {
    super();
  }

  ngOnInit() {
    this.liquidationPrice$ = this.middleware.liquidationPrice$(this.leverage$);
    this.liquidationLossPercentage$ = this.middleware.liquidationPenaltyPercentage$(this.leverage$)
      .pipe(
        startWith(-0.6),
        map(x => -x)
      );
    this.portfolioValue$ = this.middleware.positionValueInUsdAtFuturePrice$(this.price$, this.leverage$, this.quantity$);
    this.priceToGain100$ = this.middleware.futurePriceInUsdForPercentChange$(100, this.leverage$);
    this.priceToGain50$ = this.middleware.futurePriceInUsdForPercentChange$(50, this.leverage$);
    this.priceToGain0$ = this.middleware.futurePriceInUsdForPercentChange$(0, this.leverage$);
    this.priceToLose50$ = this.middleware.futurePriceInUsdForPercentChange$(-50, this.leverage$);
    this.maxLossPercentage$ = this.middleware.percentageChangeForFuturePrice$(this.liquidationPrice$, this.leverage$)
      .pipe(
        startWith(-0.5),
        map(x => -x),
      );
    this.priceAtCursor$ = combineLatest(this.priceToGain100$, this.liquidationPrice$, fromEvent<MouseEvent>(this.gradient.nativeElement, 'pointermove'))
      .pipe(map(this.mouseMoveInChart));
    this.portfolioValueAtCursor$ = this.middleware.positionValueInUsdAtFuturePrice$(this.priceAtCursor$, this.leverage$, this.quantity$);

    combineLatest(
      this.priceToGain100$,
      this.priceToGain50$,
      this.priceToGain0$,
      this.liquidationPrice$,
    ).subscribe(([price100, price50, price0, priceLiquidation]) => {
      const dashedValueNormalized = (price50 - priceLiquidation) / (price100 - priceLiquidation);
      const dottedValueNormalized = (price0 - priceLiquidation) / (price100 - priceLiquidation);
      this.dashedLine.nativeElement.setAttribute('style', `top: ${235 + (-118 - 235) * dashedValueNormalized}px`);
      this.dottedLine.nativeElement.setAttribute('style', `top: ${118 + (-235 - 118) * dottedValueNormalized}px`);
    });

    // shift the bottom text to avoid overlapping
    this.leverage$.subscribe(leverage => {
      if (leverage > 2.8) {
        this.bottomLineText.nativeElement.setAttribute('style', `padding-left: 80px;`);
      } else {
        this.bottomLineText.nativeElement.removeAttribute('style');
      }
    });

  }

  clickMoreDetails() {
    this.isHideDetails = !this.isHideDetails;
    this.isShowDetails = !this.isShowDetails;
  }

  mouseMoveInChart = ([priceToGain100, liquidationPrice, mouseEvent]: [number, number, MouseEvent]) => {
    const gradientElement = this.gradient.nativeElement;
    const expandElement = gradientElement.parentElement.parentElement;
    const gradientClientY = gradientElement.getBoundingClientRect().top;
    const gradientPageY = gradientClientY + window.scrollY;
    const expandClientY = expandElement.getBoundingClientRect().top;
    const expandPageY = expandClientY + window.scrollY;
    const mouseRelativeToGradientY = mouseEvent.pageY - gradientPageY;
    const mouseRelativeToExpandY = mouseEvent.pageY - expandPageY;
    const gradientHeight = gradientElement.getBoundingClientRect().height;
    this.priceLine.nativeElement.setAttribute('style', `top: ${mouseRelativeToGradientY - 5}px`);
    this.toolTipBox.nativeElement.setAttribute('style', `top: ${mouseRelativeToExpandY}px`);
    return Math.round(priceToGain100 - (mouseRelativeToGradientY / gradientHeight) * (priceToGain100 - liquidationPrice));
  }

  mouseEnterChart() {
    this.isMouseInChart = true;
  }

  mouseLeaveChart() {
    this.isMouseInChart = false;
  }

}
