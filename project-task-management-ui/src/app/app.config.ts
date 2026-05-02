import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { icons } from './icons-provider';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { ar_EG, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import ar from '@angular/common/locales/ar';

registerLocaleData(ar);

// Extend ar_EG with missing translations
const customArEG = {
  ...ar_EG,
  DatePicker: {
    ...ar_EG.DatePicker,
    lang: {
      ...ar_EG.DatePicker?.lang,
      rangeQuarterPlaceholder: ['البداية', 'النهاية']
    }
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideNzIcons(icons),
    provideNzI18n(customArEG),
  ],
};
