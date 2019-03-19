import { EventEmitter, Injectable, NgZone } from '@angular/core';
import { combineLatest, Observable, BehaviorSubject } from 'rxjs';
import { map, mergeMap, filter, debounceTime, shareReplay } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { environment } from '../../../environments/environment';

import { LiquidLong, Address } from '@keydonix/liquid-long-client-library';
import { LoggerService } from '../logger/logger.service';

interface AsyncSendable {
  sendAsync?: (request: any, callback: (error: any, response: any) => void) => void;
}

declare global {
  interface Window {
    web3: {
      currentProvider: AsyncSendable;
    };
    ethereum: AsyncSendable & {
      enable: () => Promise<void>;
    };
  }
}


@Injectable({
  providedIn: 'root',
})
export class MiddlewareService {
  private liquidLong: LiquidLong;
  public ethereumEnabled$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public price$: Observable<number>;
  public maxLeverageSize$: Observable<number>;

  constructor(private logger: LoggerService, private zone: NgZone) {
    const priceFeed = new EventEmitter<number>();
    const maxLeverageSizeFeed = new EventEmitter<number>();
    this.price$ = priceFeed.pipe(shareReplay(1));
    this.maxLeverageSize$ = maxLeverageSizeFeed.pipe(shareReplay(1));

    this.liquidLong = this.createLiquidLong();
    let oldPrice = 0;
    this.liquidLong.registerForEthPriceUpdated(newEthPriceInUsd => {
      zone.run(() => priceFeed.emit(newEthPriceInUsd));
      if (oldPrice === newEthPriceInUsd) return;
      this.logger.log(`newEthPriceInUsd=`, newEthPriceInUsd);
      oldPrice = newEthPriceInUsd;
    });
    let oldMaxLeverageSize = 0;
    this.liquidLong.registerForMaxLeverageSizeUpdate(newMaxLeverageSizeInEth => {
      zone.run(() => maxLeverageSizeFeed.emit(newMaxLeverageSizeInEth));
      if (oldMaxLeverageSize === newMaxLeverageSizeInEth) return;
      this.logger.log(`newMaxLeverageSizeInEth=${newMaxLeverageSizeInEth}`);
      oldMaxLeverageSize = newMaxLeverageSizeInEth;
    })
  }

  static isWeb3Compatible(): boolean {
    return !!(window.ethereum || window.web3);
  }

  public enableEthereum = async (): Promise<void> => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
      } finally {
        this.ethereumEnabled$.next(false);
      }
    }
    this.ethereumEnabled$.next(true);
  }

  private createLiquidLong = (): LiquidLong => {
    if (window.ethereum) {
      return LiquidLong.createWeb3(
        window.ethereum,
        environment.liquidLongContractAddress,
        async () => undefined,
        environment.web3PollingInterval,
        environment.ethPricePollingFrequency,
        environment.providerFeePollingFrequency,
      );
    } else if (window.web3 && window.web3.currentProvider) {
      return LiquidLong.createWeb3(
        window.web3.currentProvider,
        environment.liquidLongContractAddress,
        async () => undefined,
        environment.web3PollingInterval,
        environment.ethPricePollingFrequency,
        environment.providerFeePollingFrequency,
      );
    } else {
      return LiquidLong.createJsonRpc(
        environment.jsonRpcAddress,
        environment.liquidLongContractAddress,
        async () => undefined,
        environment.web3PollingInterval,
        environment.ethPricePollingFrequency,
        environment.providerFeePollingFrequency,
      );
    }
  }

  providerFee$(leverageMultiplier$: Observable<number>, leverageSizeInEth$: Observable<number>): Observable<number> {
    this.logger.log(`method providerFee$`);
    return combineLatest(leverageMultiplier$, leverageSizeInEth$)
      .pipe(
        mergeMap(([leverageMultiplier, leverageSizeInEth]) =>
          fromPromise(this.liquidLong.getFeeInEth(leverageMultiplier, leverageSizeInEth))),
      );
  }

  liquidationPrice$(leverageMultiplier$: Observable<number>) {
    this.logger.log(`method liquidationPrice$`);
    return leverageMultiplier$
      .pipe(
        mergeMap(leverage => fromPromise(this.liquidLong.getLiquidationPriceInUsd(leverage))),
      );
  }

  liquidationPenaltyPercentage$(leverageMultiplier$: Observable<number>) {
    this.logger.log(`method liquidationPenaltyPercentage$`);
    return leverageMultiplier$
      .pipe(
        map(leverage => this.liquidLong.getLiquidationPenaltyPercent(leverage)),
      );
  }

  positionValueInUsdAtFuturePrice$(
    futurePriceInUsd$: Observable<number>,
    leverageMultiplier$: Observable<number>,
    leverageSizeInEth$: Observable<number>
  ) {
    this.logger.log(`method positionValueInUsdAtFuturePrice$`);
    return combineLatest(futurePriceInUsd$, leverageMultiplier$, leverageSizeInEth$)
      .pipe(
        mergeMap(([futurePriceInUsd, leverageMultiplier, leverageSizeInEth]) =>
          fromPromise(this.liquidLong.getPositionValueInUsdAtFuturePrice(futurePriceInUsd, leverageMultiplier, leverageSizeInEth)),
        ),
      );
  }

  futurePriceInUsdForPercentChange$(
    percentChangeFromCurrent: number,
    leverageMultiplier$: Observable<number>,
  ) {
    this.logger.log(`method futurePriceInUsdForPercentChange$`);
    return leverageMultiplier$
      .pipe(
        mergeMap(leverageMultiplier =>
          fromPromise(this.liquidLong.getFuturePriceInUsdForPercentChange(percentChangeFromCurrent / 100, leverageMultiplier)),
        ),
      );
  }

  percentageChangeForFuturePrice$(
    futurePriceInUsd$: Observable<number>,
    leverageMultiplier$: Observable<number>,
  ) {
    this.logger.log(`method percentageChangeForFuturePrice$`);
    return combineLatest(futurePriceInUsd$, leverageMultiplier$)
      .pipe(
        mergeMap(([futurePriceInUsd, leverageMultiplier]) =>
          fromPromise(this.liquidLong.getPercentageChangeForFuturePrice(futurePriceInUsd, leverageMultiplier)),
        ),
      );
  }

  estimatedCostsInEth$(
    leverageMultiplier$: Observable<number>,
    leverageSizeInEth$: Observable<number>,
  ) {
    this.logger.log(`method estimatedCostsInEth$`);
    return combineLatest(leverageMultiplier$, leverageSizeInEth$)
      .pipe(
        debounceTime(500),
        filter(([leverageMultiplier, leverageSizeInEth]) => {
          return !!leverageMultiplier && !!leverageSizeInEth
        }),
        mergeMap(([leverageMultiplier, leverageSizeInEth]) =>
          fromPromise(this.liquidLong.getEstimatedCostsInEth(leverageMultiplier, leverageSizeInEth))
        ),
      );
  }

  submit(
    leverageMultiplier: number,
    leverageSizeInEth: number,
    costLimitInEth: number,
    feeLimitInEth: number,
    affiliate: Address,
  ) {
    this.logger.log(`method submit`);

    return this.enableEthereum()
      .then(() => {
        return this.liquidLong.openPosition(
          leverageMultiplier,
          leverageSizeInEth,
          costLimitInEth,
          feeLimitInEth,
          affiliate)
        }
      );
  }

}
