import { EventEmitter, Injectable } from '@angular/core';
import { combineLatest, Observable, BehaviorSubject } from 'rxjs';
import { map, mergeMap, filter, debounceTime, shareReplay } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { environment } from '../../../environments/environment';

import { LiquidLong } from '@keydonix/liquid-long-client-library';
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
  public priceFeed$ = new EventEmitter<number>();
  public price$ = this.priceFeed$.pipe(shareReplay(1));

  constructor(private logger: LoggerService) {
    this.liquidLong = this.createLiquidLong();
    let oldPrice = 0;
    this.liquidLong.registerForEthPriceUpdated(newEthPriceInUsd => {
      if (oldPrice !== newEthPriceInUsd) {
        this.logger.log(`newEthPriceInUsd=`, newEthPriceInUsd);
        oldPrice = newEthPriceInUsd;
      }
      this.priceFeed$.emit(newEthPriceInUsd);
    });
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
        environment.defaultEthPriceInUsd,
        environment.defaultProviderFeeRate,
        environment.web3PollingInterval,
        environment.ethPricePollingFrequency,
        environment.providerFeePollingFrequency,
      );
    } else if (window.web3 && window.web3.currentProvider) {
      return LiquidLong.createWeb3(
        window.web3.currentProvider,
        environment.liquidLongContractAddress,
        environment.defaultEthPriceInUsd,
        environment.defaultProviderFeeRate,
        environment.web3PollingInterval,
        environment.ethPricePollingFrequency,
        environment.providerFeePollingFrequency,
      );
    } else {
      return LiquidLong.createJsonRpc(
        environment.jsonRpcAddress,
        environment.liquidLongContractAddress,
        environment.defaultEthPriceInUsd,
        environment.defaultProviderFeeRate,
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
    affiliate: string,
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
