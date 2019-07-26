import { TestBed, inject } from '@angular/core/testing';

import { RouterEventHendlerService } from './router-event-hendler.service';

describe('RouterEventHendlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouterEventHendlerService]
    });
  });

  it('should be created', inject([RouterEventHendlerService], (service: RouterEventHendlerService) => {
    expect(service).toBeTruthy();
  }));
});
