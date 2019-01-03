import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputQuantityComponent } from './input-quantity.component';
import { FormsModule } from '@angular/forms';
import { click } from '../test-helper';


describe('InputQuantityComponent', () => {
  let component: InputQuantityComponent;
  let fixture: ComponentFixture<InputQuantityComponent>;
  let compiled: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputQuantityComponent],
      imports: [
        FormsModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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
