import { TestBed, async } from '@angular/core/testing';
import { MainPageComponent } from './main-page.component';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MiddlewareService } from '../../services/middleware/middleware.service';

@Component({selector: 'app-input-leverage', template: ''})
class InputLeverageStubComponent {}

@Component({selector: 'app-input-quantity', template: ''})
class InputQuantityStubComponent {
  @Input() maxValue: number;
}

@Component({selector: 'app-input-fee', template: ''})
class InputFeeStubComponent {
  @Input() maxValue: number;
}

@Component({selector: 'app-info-panel', template: ''})
class InfoPanelStubComponent {
  @Input() price$ = new EventEmitter<number>();
}

@Component({selector: 'app-confirm-panel', template: ''})
class ConfirmPanelStubComponent {
  @Input() price: number;
  @Input() fee: number;
  // @Output() confirm: EventEmitter<void>;
  @Output() confirm = new EventEmitter<void>();
}


describe('MainPageComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainPageComponent,
        InputLeverageStubComponent,
        InputQuantityStubComponent,
        InputFeeStubComponent,
        InfoPanelStubComponent,
        ConfirmPanelStubComponent,
      ],
      providers: [MiddlewareService],
      // schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(MainPageComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(MainPageComponent);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Open a Leveraged ETH position');
  }));

  describe('Wrong browser warning', () => {
    it('should disappear after the user installs MetaMask');
  });

});
