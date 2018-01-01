import { TestBed, inject } from '@angular/core/testing';

import { LineService } from './line.service';

describe('LineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LineService]
    });
  });

  it('should be created', inject([LineService], (service: LineService) => {
    expect(service).toBeTruthy();
  }));
});
