import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TokenInterceptor } from '../shared/interceptors/token.interceptor';
import { InjectionToken } from '@angular/core';
import { environment } from '../environments/environment';
import { REMOTE_BASE_URL } from '../shared/service-proxies/remote-service-proxies';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([TokenInterceptor])),
    {
      provide: REMOTE_BASE_URL,
      useValue: environment.REMOTE_BASE_URL
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
};
