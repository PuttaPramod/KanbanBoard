import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Chart.js registration for controllers used by ng2-charts
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
