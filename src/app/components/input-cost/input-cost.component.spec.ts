import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCostComponent } from './input-cost.component';
import { FormsModule } from '@angular/forms';
import { click } from '../test-helper';
import { EventEmitter } from '@angular/core';

describe('InputFeeComponent', () => {
  let component: InputCostComponent;
  let fixture: ComponentFixture<InputCostComponent>;
  let compiled: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputCostComponent],
      imports: [
        FormsModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputCostComponent);
    component = fixture.componentInstance;
    component.exchangeCostRangeLimits$ = new EventEmitter<{low: number, high: number}>();
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('gradient part', () => {
    it('should generate event when clicked');
    it('should generate event when I move the slider');
  });

  describe('input part', () => {
    it('should generate event when changed', (done) => {
      const inputField = compiled.querySelector('.inputbox input') as HTMLInputElement;
      const enterString = (value) => {
        inputField.value = value;
        inputField.dispatchEvent(new Event('input'));
        fixture.detectChanges();
      };
      const expectedSequence = [1, 2, 99, 100, 501, 250, 0, null, 400];

      component.value$.subscribe(event => {
        expect(event).toBe(expectedSequence.shift());
        if (expectedSequence.length === 0) {
          done();
        }
      });

      ['1', '2', '99', '100', '501', '250', '0', '', '400'].forEach(enterString);
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

  describe('rounding function to avoid long ugly fractions', () => {

    const dataArr = [
      { in: 1, out: 1 },
      { in: 123, out: 123 },
      { in: 1.1, out: 1.1 },
      { in: 1.555, out: 1.555 },
      { in: 1.3339, out: 1.334 },
      { in: 12.6666, out: 12.667 },
      { in: 12.6665, out: 12.6661 },
      { in: 0.050000000000000044, out: 0.0501 },
      { in: 0.10000000000000009, out: 0.1001 },
      { in: 0.04500000000000004, out: 0.0451 },
      { in: 0.09000000000000008, out: 0.0901 },
      { in: 0.050000000000000044, out: 0.0501 },
      { in: 0.10000000000000009, out: 0.1001 },
      { in: 0.05500000000000016, out: 0.0551 },
      { in: 0.11000000000000032, out: 0.1101 },
      { in: 0.06000000000000005, out: 0.0601 },
      { in: 0.1200000000000001, out: 0.1201 },
      { in: 0.06500000000000017, out: 0.0651 },
      { in: 0.13000000000000034, out: 0.1301 },
      { in: 0.07000000000000006, out: 0.0701 },
      { in: 0.14000000000000012, out: 0.1401 },
      { in: 0.07500000000000018, out: 0.0751 },
      { in: 0.15000000000000036, out: 0.1501 },
      { in: 0.08000000000000007, out: 0.0801 },
      { in: 0.16000000000000014, out: 0.1601 },
      { in: 0.08499999999999996, out: 0.085 },
      { in: 0.16999999999999993, out: 0.17 },
    ];
    for (let i = 0; i < dataArr.length; i++) {
      it(`${i + 1}: should return ${dataArr[i].out} by getting ${dataArr[i].in}`, () => {
        expect(
          InputCostComponent.fixRounding(dataArr[i].in),
          // InputCostComponent.toSignificantFigures(dataArr[i].in, 2, Math.ceil)
        ).toEqual(dataArr[i].out);
      });
    }

  });

});
