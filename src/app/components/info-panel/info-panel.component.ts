import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ToolTipComponent } from '../tool-tip-component';
import { MiddlewareService } from '../../services/middleware/middleware.service';
import { combineLatest, Observable } from 'rxjs';
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
  @ViewChild('priceLine') priceLine: ElementRef<HTMLDivElement>;
  @ViewChild('dashedLine') dashedLine: ElementRef<HTMLDivElement>;
  @ViewChild('dottedLine') dottedLine: ElementRef<HTMLDivElement>;
  @ViewChild('toolTipBox') toolTipBox: ElementRef<HTMLDivElement>;
  @ViewChild('bottomLineText') bottomLineText: ElementRef<HTMLDivElement>;
  priceLineStyle: Attr;
  toolTipStyle: Attr;
  bottomLineTextStyle: Attr;
  // priceLine: TemplateRef<HTMLDivElement>;
  isHideDetails = true;
  isShowDetails = false;
  isBannerShown = false;

  liquidationPrice$: Observable<number>;
  liquidationPenaltyProcentage$: Observable<number>;
  portfolioValue$: Observable<number>;
  priceToGain100$: Observable<number>;
  priceToGain50$: Observable<number>;
  priceToGain0$: Observable<number>;
  priceToLose50$: Observable<number>;
  percentToLoose$: Observable<number>;

  portfolioValue: number;
  price: number;

  constructor(
    private middleware: MiddlewareService,
  ) {
    super();
  }

  ngOnInit() {
    this.liquidationPrice$ = this.middleware.liquidationPrice$(this.leverage$);
    this.liquidationPenaltyProcentage$ = this.middleware.liquidationPenaltyPercentage$(this.leverage$);
    this.portfolioValue$ = this.middleware.positionValueInUsdAtFuturePrice$(this.price$, this.leverage$, this.quantity$);
    this.priceToGain100$ = this.middleware.futurePriceInUsdForPercentChange$(100, this.leverage$);
    this.priceToGain50$ = this.middleware.futurePriceInUsdForPercentChange$(50, this.leverage$);
    this.priceToGain0$ = this.middleware.futurePriceInUsdForPercentChange$(0, this.leverage$);
    this.priceToLose50$ = this.middleware.futurePriceInUsdForPercentChange$(-50, this.leverage$);
    this.percentToLoose$ = this.middleware.percentageChangeForFuturePrice$(this.liquidationPrice$, this.leverage$)
      .pipe(
        startWith(0.5),
        map(x => -x),
      );

    this.price$.subscribe(price => this.price = price);
    this.portfolioValue$.subscribe(portfolioValue => this.portfolioValue = portfolioValue);

    this.priceLineStyle = this.priceLine.nativeElement.attributes.getNamedItem('style');
    const dashedLineStyle = this.dashedLine.nativeElement.attributes.getNamedItem('style');
    const dottedLineStyle = this.dottedLine.nativeElement.attributes.getNamedItem('style');
    this.toolTipStyle = this.toolTipBox.nativeElement.attributes.getNamedItem('style');
    this.bottomLineTextStyle = this.bottomLineText.nativeElement.attributes.getNamedItem('style');

    combineLatest(
      this.priceToGain100$,
      this.priceToGain50$,
      this.priceToGain0$,
      this.liquidationPrice$,
    ).subscribe(([price100, price50, price0, priceLiquidation]) => {
      const dashedValueNormalized = (price50 - priceLiquidation) / (price100 - priceLiquidation);
      const dottedValueNormalized = (price0 - priceLiquidation) / (price100 - priceLiquidation);
      // priceLineStyle.value = `top: ${614 + (262 - 614) * normalizedValue}px`;
      dashedLineStyle.value = `top: ${235 + (-118 - 235) * dashedValueNormalized}px`;
      dottedLineStyle.value = `top: ${118 + (-235 - 118) * dottedValueNormalized}px`;
    });

    this.middleware.isAccessDenied$.subscribe(isAccessDenied => {
      this.isBannerShown = isAccessDenied || !MiddlewareService.isWeb3Compatible();
    });

    // shift the bottom text to avoid overlapping
    this.leverage$.subscribe(leverage => {
      if (leverage > 2.8) {
        this.bottomLineTextStyle.value = `padding-left: 80px;`;
      } else {
        this.bottomLineTextStyle.value = ``;
      }
    });

  }

  clickMoreDetails() {
    this.isHideDetails = !this.isHideDetails;
    this.isShowDetails = !this.isShowDetails;
  }

  mouseEnterChart(event: MouseEvent) {
    this.mouseMoveInChart(event);
  }

  mouseMoveInChart(event: MouseEvent) {
    // this.priceLineStyle.value = `top: ${event.screenY - 30}px`;  // 30 === gradient-wrapper.margin

    // 145 - default offset; 85 - in case of warning;
    this.priceLineStyle.value = `top: ${event.pageY - 145 - (this.isBannerShown ? 85 : 0)}px`;
    // 262px - 612px
    this.toolTipStyle.value = `top: ${event.pageY - 145 - (this.isBannerShown ? 85 : 0) - 81}px; left: ${event.layerX - 35}px`;
  }

  mouseLeaveChart() {
    this.priceLineStyle.value = 'display: none;';
    this.toolTipStyle.value = 'display: none;';
  }

}
