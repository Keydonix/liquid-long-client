import { TestBed } from '@angular/core/testing';

import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log messages', () => {
    const spy = spyOn(console, 'log');
    service.log('logged message');
    expect(spy.calls.count()).toBe(1);
    expect(spy.calls.first().args[0]).toBe('logged message');
  });

  it('should log warnings', () => {
    const spy = spyOn(console, 'warn');
    service.warn('warn message');
    expect(spy.calls.count()).toBe(1);
    expect(spy.calls.first().args[0]).toBe('warn message');
  });

  it('should log errors', () => {
    const spy = spyOn(console, 'error');
    service.error('error message');
    expect(spy.calls.count()).toBe(1);
    expect(spy.calls.first().args[0]).toBe('error message');
  });

});
