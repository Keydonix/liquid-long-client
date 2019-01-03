import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPanelComponent } from './info-panel.component';
import { click } from '../test-helper';
import { EventEmitter } from '@angular/core';

describe('InfoPanelComponent', () => {
  let component: InfoPanelComponent;
  let fixture: ComponentFixture<InfoPanelComponent>;
  let compiled: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPanelComponent);
    component = fixture.componentInstance;
    component.price$ = new EventEmitter<number>();

    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('tooltip part', () => {
    it('should pop up/disappear when question mark is clicked', () => {
      const questionMark = compiled.querySelector('.gradient-wrapper') as HTMLSpanElement;
      const tooltipText = 'Price $482.25Position Value: $107,500';  // FIXME: take it from @Input()

      expect(compiled.textContent).not.toContain(tooltipText);

      click(questionMark);
      fixture.detectChanges();
      expect(compiled.textContent).toContain(tooltipText);

      click(questionMark);
      fixture.detectChanges();
      expect(compiled.textContent).not.toContain(tooltipText);
    });
  });

  describe('leverage overflow tests', () => {
    it('it should go from 1 to 3 and corresponding calculated values should not have more that 2 digits after a decimat point');
  });

});
