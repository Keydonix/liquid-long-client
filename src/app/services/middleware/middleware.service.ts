import { EventEmitter, Injectable } from '@angular/core';
import { combineLatest, concat, Observable } from 'rxjs';
import { ignoreElements, map, mergeMap } from 'rxjs/operators';
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
declare const web3: typeof window.web3;
declare const ethereum: typeof window.ethereum;


@Injectable({
  providedIn: 'root',
})
export class MiddlewareService {
  private provider: AsyncSendable;
  private liquidLong: LiquidLong;
  private waitingForUserToEnable: Promise<void>;
  price$ = new EventEmitter<number>();
  isAccessDenied$ = new EventEmitter<boolean>();

  constructor(private logger: LoggerService) {
    let isMetamaskProvider: boolean;

    if (window.ethereum) {
      // Modern dapp browsers...
      this.provider = ethereum;

      // Request account access if needed
      this.waitingForUserToEnable = new Promise<void>(resolve => {
        return Promise.race([
          ethereum.enable(),
          new Promise((resolve1, reject) => setTimeout(reject, environment.timeoutToSwitchToJsonRpc)),
        ])
          .then(() => {
            // Acccounts now exposed
            isMetamaskProvider = true;
            this.isAccessDenied$.emit(false);
            resolve();
          })
          .catch(() => {
            // User denied account access...
            this.logger.warn(`User denied account access or timeout`);
            isMetamaskProvider = false;
            this.isAccessDenied$.emit(true);
            resolve();
          });
      });
    } else if (window.web3) {
      // Legacy dapp browsers...
      this.provider = web3.currentProvider;
      // Acccounts always exposed
      this.waitingForUserToEnable = Promise.resolve();
      isMetamaskProvider = true;
    } else {
      // Non-dapp browsers...
      this.waitingForUserToEnable = Promise.resolve();
      isMetamaskProvider = false;
      this.logger.error('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    this.waitingForUserToEnable
      .then(() => {

        if (isMetamaskProvider) {
          this.liquidLong = LiquidLong.createWeb3(
            this.provider,
            environment.liquidLongContractAddress,
            environment.defaultEthPriceInUsd,
            environment.defaultProviderFeeRate,
            environment.web3PollingInterval,
            environment.ethPricePollingFrequency,
            environment.providerFeePollingFrequency,
          );
        } else {
          this.liquidLong = LiquidLong.createJsonRpc(
            environment.jsonRpcAddress,
            environment.liquidLongContractAddress,
            environment.defaultEthPriceInUsd,
            environment.defaultProviderFeeRate,
            environment.web3PollingInterval,
            environment.ethPricePollingFrequency,
            environment.providerFeePollingFrequency,
          );
        }

        let oldPrice = 0;
        this.liquidLong.registerForEthPriceUpdated(newEthPriceInUsd => {
          if (oldPrice !== newEthPriceInUsd) {
            this.logger.log(`newEthPriceInUsd=`, newEthPriceInUsd);
            oldPrice = newEthPriceInUsd;
          }
          this.price$.emit(newEthPriceInUsd);
        });

      });

  }

  static isWeb3Compatible(): boolean {
    return !!(window.ethereum || window.web3);
  }

  providerFee$(leverageMultiplier$: Observable<number>, leverageSizeInEth$: Observable<number>): Observable<number> {
    this.logger.log(`method providerFee$`);
    return concat(
      fromPromise(this.waitingForUserToEnable).pipe(
        ignoreElements(),
      ),
      combineLatest(leverageMultiplier$, leverageSizeInEth$)
        .pipe(
          mergeMap(([leverageMultiplier, leverageSizeInEth]) =>
            fromPromise(this.liquidLong.getFeeInEth(leverageMultiplier, leverageSizeInEth))),
        )
    );
  }

  liquidationPrice$(leverageMultiplier$: Observable<number>) {
    this.logger.log(`method liquidationPrice$`);
    return concat(
      fromPromise(this.waitingForUserToEnable).pipe(
        ignoreElements(),
      ),
      leverageMultiplier$
        .pipe(
          mergeMap(leverage => fromPromise(this.liquidLong.getLiquidationPriceInUsd(leverage))),
        )
    );
  }

  liquidationPenaltyPercentage$(leverageMultiplier$: Observable<number>) {
    this.logger.log(`method liquidationPenaltyPercentage$`);
    return concat(
      fromPromise(this.waitingForUserToEnable).pipe(
        ignoreElements(),
      ),
      leverageMultiplier$
        .pipe(
          map(leverage => this.liquidLong.getLiquidationPenaltyPercent(leverage)),
        )
    );
  }

  positionValueInUsdAtFuturePrice$(
    futurePriceInUsd$: Observable<number>,
    leverageMultiplier$: Observable<number>,
    leverageSizeInEth$: Observable<number>
  ) {
    this.logger.log(`method positionValueInUsdAtFuturePrice$`);
    return concat(
      fromPromise(this.waitingForUserToEnable).pipe(
        ignoreElements(),
      ),
      combineLatest(futurePriceInUsd$, leverageMultiplier$, leverageSizeInEth$)
        .pipe(
          mergeMap(([futurePriceInUsd, leverageMultiplier, leverageSizeInEth]) =>
            fromPromise(this.liquidLong.getPositionValueInUsdAtFuturePrice(futurePriceInUsd, leverageMultiplier, leverageSizeInEth)),
          ),
        )
    );
  }

  futurePriceInUsdForPercentChange$(
    percentChangeFromCurrent: number,
    leverageMultiplier$: Observable<number>,
  ) {
    this.logger.log(`method futurePriceInUsdForPercentChange$`);
    return concat(
      fromPromise(this.waitingForUserToEnable).pipe(
        ignoreElements(),
      ),
      leverageMultiplier$
        .pipe(
          mergeMap(leverageMultiplier =>
            fromPromise(this.liquidLong.getFuturePriceInUsdForPercentChange(percentChangeFromCurrent / 100, leverageMultiplier)),
          ),
        )
    );
  }

  percentageChangeForFuturePrice$(
    futurePriceInUsd$: Observable<number>,
    leverageMultiplier$: Observable<number>,
  ) {
    this.logger.log(`method percentageChangeForFuturePrice$`);
    return concat(
      fromPromise(this.waitingForUserToEnable).pipe(
        ignoreElements(),
      ),
      combineLatest(futurePriceInUsd$, leverageMultiplier$)
        .pipe(
          mergeMap(([futurePriceInUsd, leverageMultiplier]) =>
            fromPromise(this.liquidLong.getPercentageChangeForFuturePrice(futurePriceInUsd, leverageMultiplier)),
          ),
        ))
      ;
  }

  estimatedCostsInEth$(
    leverageMultiplier$: Observable<number>,
    leverageSizeInEth$: Observable<number>,
  ) {
    this.logger.log(`method estimatedCostsInEth$`);
    return concat(
      fromPromise(this.waitingForUserToEnable).pipe(
        ignoreElements(),
      ),
      combineLatest(leverageMultiplier$, leverageSizeInEth$)
        .pipe(
          mergeMap(([leverageMultiplier, leverageSizeInEth]) =>
            fromPromise(this.liquidLong.getEstimatedCostsInEth(leverageMultiplier, leverageSizeInEth)),
          ),
        )
    );
  }

  submit(
    leverageMultiplier: number,
    leverageSizeInEth: number,
    costLimitInEth: number,
    feeLimitInEth: number,
  ) {
    this.logger.log(`method submit`);
    return this.waitingForUserToEnable
      .then(() => window.ethereum
        ? ethereum.enable().catch(() => ethereum.enable())
        : Promise.resolve()
      )
      .then(() => this.liquidLong.openPosition(
        leverageMultiplier,
        leverageSizeInEth,
        costLimitInEth,
        feeLimitInEth,
      ));

  }

}
