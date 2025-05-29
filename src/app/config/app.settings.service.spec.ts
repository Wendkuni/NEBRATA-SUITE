import { TestBed } from '@angular/core/testing';

import { AppSettingsService } from './app.settings.service';

describe('App.SettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppSettingsService = TestBed.get(AppSettingsService);
    expect(service).toBeTruthy();
  });
});
