import { DailyWeather } from './daily-weather';
import { WeatherDescription } from './weather-description';

export interface Weather {
  current: {
    temp: number;
    weather: WeatherDescription[];
  };
  daily: DailyWeather[];
}
