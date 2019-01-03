import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { InputLeverageComponent } from './input-leverage.component';

import { getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';
import { throttleTime } from 'rxjs/operators';
import { click } from '../test-helper';
// import { MonoTypeOperatorFunction, SchedulerLike } from '../../../../node_modules/rxjs/src/internal/types';
// import { defaultThrottleConfig, ThrottleConfig } from '../../../../node_modules/rxjs/src/internal/operators/throttle';
// import { Observable } from '../../../../node_modules/rxjs/src/internal/Observable';
// import { AsyncScheduler } from '../../../../node_modules/rxjs/src/internal/scheduler/AsyncScheduler';
// import { AsyncAction } from '../../../../node_modules/rxjs/src/internal/scheduler/AsyncAction';


describe('InputLeverageComponent', () => {
  let component: InputLeverageComponent;
  let fixture: ComponentFixture<InputLeverageComponent>;
  let compiled: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputLeverageComponent],
      imports: [
        FormsModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputLeverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // I have no idea how to test that placeholder is __visible__
  it('should start from placeholder', () => {
    // const inputBox = compiled.querySelector('.inputbox') as HTMLDivElement;
    // expect(inputBox.textContent).toContain('Type the multiplier or choose it above');
  });

  describe('gradient part', () => {
    it('should generate event when clicked');             // TODO
    it('should generate event when I move the slider');   // TODO
  });

  describe('button part', () => {
    it('should generate events when clicked', (done) => {
      const buttonPanel = compiled.querySelector('.values.shadow') as HTMLDivElement;
      const getButton = (n: number) => buttonPanel.querySelector(`span:nth-child(${n})`) as HTMLSpanElement;
      const expectedSequence = [1.05, 1.50, 2.00, 2.50, 2.95,
        2.00, 1.05, 2.50,
      ];

      component.value$.subscribe(event => {
        expect(event).toBe(expectedSequence.shift());
        if (expectedSequence.length === 0) {
          done();
        }
      });
      for (let i = 1; i < 6; i++) {
        click(getButton(i));
      }
      click(getButton(3));
      click(getButton(1));
      click(getButton(4));

    });

    xit('WIP: should generate events when clicked (marbles)', () => {
      const buttonPanel = compiled.querySelector('.values.shadow') as HTMLDivElement;
      const getButton = (n: string) => buttonPanel.querySelector(`span:nth-child(${n})`) as HTMLSpanElement;


      const scheduler = new TestScheduler((actual, expected) => {
        // asserting the two objects are equal
        // e.g. using chai.
        // expect(actual).deep.equal(expected);
        expect(actual).toEqual(expected);
      });

      // function testOperator<T>(duration: number,
      //                          schedulerLike: SchedulerLike = new AsyncScheduler(AsyncAction),
      //                          config: ThrottleConfig = defaultThrottleConfig): MonoTypeOperatorFunction<T> {
      //   return (source: Observable<T>) => source;
      // }

      scheduler.run(helpers => {
        const {cold, expectObservable, expectSubscriptions} = helpers;
        const e1 = cold('-a--b--c---|');
        const subs = '^----------!';
        const expected = '-a-----c---|';

        e1.subscribe(getButton);

        expectObservable(e1.pipe(throttleTime(3, scheduler))).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(subs);
      });


      // expect(component.value).toBe('');
      getTestScheduler().flush();
    });
  });

  describe('input part', () => {
    it('should generate event when changed', (done) => {
      const inputField = compiled.querySelector('.inputbox input') as HTMLInputElement;
      const enterString = (value) => {
        inputField.value = value;
        inputField.dispatchEvent(new Event('input'));
        fixture.detectChanges();
      };
      const expectedSequence = [3, 1.05];

      component.value$.subscribe(event => {
        expect(event).toBe(expectedSequence.shift());
        if (expectedSequence.length === 0) {
          done();
        }
      });

      ['3', '1.05'].forEach(enterString);
    });

    it('should generate event on keypress', (done) => {
      // TODO: enter 1,05 then delete (8 keystrokes)
      // expected events: 1 1 1 1,05 1 1 1 (7 keystrokes)
      const inputField = compiled.querySelector('.inputbox input') as HTMLInputElement;
      const enterString = (value) => {
        inputField.value = value;
        inputField.dispatchEvent(new Event('input'));

        fixture.detectChanges();
      };
      const expectedSequence = [3, 1.05];

      component.value$.subscribe(event => {
        expect(event).toBe(expectedSequence.shift());
        if (expectedSequence.length === 0) {
          done();
        }
      });

      ['3', '1.05'].forEach(enterString);
    });
  });

  describe('tooltip part', () => {
    it('should pop up/disappear when question mark is clicked', () => {
      const questionMark = compiled.querySelector('.inputbox .material-icons') as HTMLSpanElement;
      const tooltipText = 'Some explanation text with external links goes here';

      expect(compiled.textContent).not.toContain(tooltipText);

      click(questionMark);
      fixture.detectChanges();
      expect(compiled.textContent).toContain(tooltipText);

      click(questionMark);
      fixture.detectChanges();
      expect(compiled.textContent).not.toContain(tooltipText);
    });
  });

});
