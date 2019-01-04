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
    public middleware: MiddlewareService,
    private router: Router,
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

  ngOnInit() { }

  enableEthereumReprompt() {
    this.middleware.enableEthereum().catch(() => {})
  }

  onSubmit() {
    this.logger.log(`Transaction submitted with values (${this.leverage}, ${this.quantity}, ${this.exchangeCost}, ${this.serviceFee}).`);

    this.middleware.submit(this.leverage, this.quantity, this.exchangeCost, this.serviceFee)
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
