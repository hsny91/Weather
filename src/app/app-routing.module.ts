import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherForecastComponent } from './components/weather-forecast/weather-forecast.component';
import { WeatherComponent } from './components/weather/weather.component';

const routes: Routes = [
  {
    path: '',
    component: WeatherComponent,
    children: [{ path: 'forecast/:zip', component: WeatherForecastComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
