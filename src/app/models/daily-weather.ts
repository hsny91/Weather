import { WeatherDescription } from './weather-description';

export interface DailyWeather {
  dt: number;
  temp: {
    min: number;
    max: number;
  };
  weather: WeatherDescription[];
}
