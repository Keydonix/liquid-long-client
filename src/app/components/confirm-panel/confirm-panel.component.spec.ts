import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPanelComponent } from './confirm-panel.component';
import { click } from '../test-helper';

describe('ConfirmPanelComponent', () => {
  let component: ConfirmPanelComponent;
  let fixture: ComponentFixture<ConfirmPanelComponent>;
  let compiled: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('tooltip part', () => {
    it('should pop up/disappear when question mark is clicked', () => {
      const questionMark = compiled.querySelector('.material-icons') as HTMLSpanElement;
      const tooltipHeader = 'Total Price';

      expect(compiled.textContent).not.toContain(tooltipHeader);

      click(questionMark);
      fixture.detectChanges();
      expect(compiled.textContent).toContain(tooltipHeader);

      click(questionMark);
      fixture.detectChanges();
      expect(compiled.textContent).not.toContain(tooltipHeader);
    });
  });

});
