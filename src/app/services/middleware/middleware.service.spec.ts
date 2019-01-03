import { TestBed, inject } from '@angular/core/testing';

import { MiddlewareService } from './middleware.service';

describe('GetPriceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MiddlewareService]
    });
  });

  it('should be created', inject([MiddlewareService], (service: MiddlewareService) => {
    expect(service).toBeTruthy();
  }));

  it('...', inject([MiddlewareService], (service: MiddlewareService) => {
    expect(service).toBeTruthy();
  }));

});
