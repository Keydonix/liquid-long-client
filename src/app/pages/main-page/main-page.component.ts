import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MiddlewareService } from '../../services/middleware/middleware.service';
import { combineLatest } from 'rxjs';
import { catchError, distinctUntilChanged, map, shareReplay, startWith } from 'rxjs/operators';
import { LoggerService } from '../../services/logger/logger.service';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  maxQuantity = environment.maxQuantity;
  price$ = this.middleware.price$
    .pipe(
      catchError((err, caught) => {
        this.logger.error(`middleware.price$ error:`, err);
        this.isNotConnected = true;
        return caught;
      }),
    );

  isDebug = false;
  isWrongBrowser = !MiddlewareService.isWeb3Compatible();
  isNotConnected = false;

  leverage: number;
  quantity: number;
  exchangeCost: number;
  serviceFee: number;
  affiliate: string;

  leverageEmitter$ = new EventEmitter<number>();
  quantityEmitter$ = new EventEmitter<number>();
  exchangeCostEmitter$ = new EventEmitter<number>();

  // Number input fires valueChanges twice: https://github.com/angular/angular/issues/12540
  leverage$ = this.leverageEmitter$.asObservable().pipe(startWith(2), distinctUntilChanged(), shareReplay(1));
  quantity$ = this.quantityEmitter$.asObservable().pipe(distinctUntilChanged(), shareReplay(1));
  exchangeCost$ = this.exchangeCostEmitter$.asObservable().pipe(distinctUntilChanged());

  exchangeCostRangeLimits$ = this.middleware.estimatedCostsInEth$(this.leverage$, this.quantity$);
  serviceFee$ = this.middleware.providerFee$(this.leverage$, this.quantity$);

  totalPrice$ = combineLatest(
    this.quantity$,
    this.exchangeCost$,
    this.serviceFee$,
  ).pipe(
    map(([leverageAmount, exchangeCost, serviceFee]) => leverageAmount + exchangeCost + serviceFee),
  );

  protected confirmEmitter$ = new EventEmitter<boolean>();
  confirm$ = this.confirmEmitter$.asObservable();

  constructor(
    public middleware: MiddlewareService,
    private router: Router,
    private route: ActivatedRoute,
    private logger: LoggerService,
  ) {
    this.leverage$.subscribe(leverage => {
      this.logger.log(`getLeverage: event=`, leverage);
      this.leverage = leverage;
    });
    this.quantity$.subscribe(quantity => {
      this.logger.log(`getQuantity: event=`, quantity);
      this.quantity = quantity;
    });
    this.exchangeCost$.subscribe(exchangeCost => {
      this.logger.log(`exchangeCost: event=`, exchangeCost);
      this.exchangeCost = exchangeCost;
    });
    this.serviceFee$.subscribe(serviceFee => {
      this.logger.log(`serviceFee: event=`, serviceFee);
      this.serviceFee = serviceFee;
    });
    this.route.queryParamMap.subscribe(queryParameters => {
      const normalizeAffiliate = (affiliate: string): string => {
        const match = /^(?:0x)?([a-zA-Z0-9]{40})$/.exec(affiliate);
        return (match) ? match[1] : '';
      };

      const localStorageGetOrSet = (key: string, defaultValue: string): string => {
        const storageValue = normalizeAffiliate(window.localStorage.getItem(key));
        if (!storageValue) {
          window.localStorage.setItem(key, defaultValue);
        }
        return storageValue || defaultValue;
      };

      const queryAffiliate = normalizeAffiliate(queryParameters.get('affiliate'));
      this.affiliate = (/ipfs/.test(window.location.hostname))
        ? queryAffiliate
        : localStorageGetOrSet('affiliate', queryAffiliate);
    });
  }

  ngOnInit() { }

  enableEthereumReprompt() {
    this.middleware.enableEthereum().catch(() => {})
  }

  onSubmit() {
    this.logger.log(`Transaction submitted with values (${this.leverage}, ${this.quantity}, ${this.exchangeCost}, ${this.serviceFee}).`);

    this.middleware.submit(this.leverage, this.quantity, this.exchangeCost, this.serviceFee, this.affiliate)
      .then(cdpId => {
        this.logger.log(`Transaction confirmed!`);
        this.confirmEmitter$.emit(true);
        this.router.navigateByUrl(`/succeed/${cdpId}`);
      })
      .catch(err => {
        this.logger.error(`Transaction rejected!`, err);
        this.confirmEmitter$.emit(true);
        this.router.navigateByUrl('/fail');
      });
  }

}
