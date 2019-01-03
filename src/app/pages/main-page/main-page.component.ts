import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MiddlewareService } from '../../services/middleware/middleware.service';
import { combineLatest } from 'rxjs';
import { catchError, distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
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

  leverageEmitter$ = new EventEmitter<number>();
  quantityEmitter$ = new EventEmitter<number>();
  exchangeCostEmitter$ = new EventEmitter<number>();

  // Number input fires valueChanges twice: https://github.com/angular/angular/issues/12540
  leverage$ = this.leverageEmitter$.asObservable().pipe(distinctUntilChanged(), shareReplay(1));
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
    private middleware: MiddlewareService,
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
  }

  ngOnInit() {
    if (this.isWrongBrowser) {
      setTimeout(() => {
        // window.location.reload(); // FIXME: it is not cross platform
      }, environment.wrongBrowserReloadInterval);
    } else {
      // temporary testing interface usign url params TODO: remove it before release
      const params = this.route.snapshot.queryParamMap.get('openPosition');
      if (params && params.length) {  // && !environment.production
        this.logger.log(`Calling openPosition(${params});`);
        this.middleware.submit.apply(this.middleware, params.split(','))
          .then(() => {
            this.logger.log(`Transaction confirmed!`);
          })
          .catch(err => {
            this.logger.error(`Transaction rejected!`, err);
          });
      }
    }
  }

  onSubmit() {
    this.logger.log(`Transaction submitted with values (${this.leverage}, ${this.quantity}, ${this.exchangeCost}, ${this.serviceFee}).`);
    // setTimeout(() => {
    //   this.confirm$.emit(true);
    // }, 0);
    // this.confirm$.emit(true);
    // return;

    this.middleware.submit(this.leverage, this.quantity, this.exchangeCost, this.serviceFee)
      .then(() => {
        this.logger.log(`Transaction confirmed!`);
        this.confirmEmitter$.emit(true);
        this.router.navigateByUrl('/succeed');
      })
      .catch(err => {
        this.logger.error(`Transaction rejected!`, err);
        this.confirmEmitter$.emit(true);
        this.router.navigateByUrl('/fail');
      });
  }

}
