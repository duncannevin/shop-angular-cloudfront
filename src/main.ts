import { Provider } from '@angular/core';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { bootstrapApplication } from '@angular/platform-browser';
import { CONFIG_TOKEN } from './app/core/injection-tokens/config.token';
import { ErrorPrintInterceptor } from './app/core/interceptors/error-print.interceptor';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app/app-routes';
import { SecureCallInterceptor } from './app/core/interceptors/secure-call-interceptor';

const interceptors: Provider[] = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorPrintInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: SecureCallInterceptor,
    multi: true,
  },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes, withComponentInputBinding()),
    interceptors,
    {
      provide: CONFIG_TOKEN,
      useValue: environment,
    },
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch((err) => console.error(err));
