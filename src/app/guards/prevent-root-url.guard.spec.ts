import { TestBed } from '@angular/core/testing';

import { PreventRootUrlGuard } from './prevent-root-url.guard';

describe('PreventRootUrlGuard', () => {
  let guard: PreventRootUrlGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PreventRootUrlGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
