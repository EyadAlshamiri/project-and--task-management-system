import { TestBed } from '@angular/core/testing';

import { Serv } from './serv';

describe('Serv', () => {
  let service: Serv;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Serv);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
