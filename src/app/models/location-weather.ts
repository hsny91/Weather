import { Weather } from './weather';
import { ZipLocation } from './zip-location';

export interface LocationWeather {
  attrs: ZipLocation;
  weather: Weather;
}
