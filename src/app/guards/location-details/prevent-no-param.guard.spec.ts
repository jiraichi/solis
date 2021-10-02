import { TestBed } from '@angular/core/testing';

import { PreventNoParamGuard } from './prevent-no-param.guard';

describe('PreventNoParamGuard', () => {
  let guard: PreventNoParamGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PreventNoParamGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
