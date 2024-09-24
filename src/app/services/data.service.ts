import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map, Observable } from 'rxjs'
import { environment } from '../../environments/environment'

export type WeatherData = {
  date: Date
  minTemp: number
  maxTemp: number
  rain: number
  wind: number
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  getData(): Observable<WeatherData[]> {
    return this.http
      .get<WeatherData[]>(this.apiUrl)
      .pipe(map((response) => this.dataResponseToWeatherData(response)))
  }

  dataResponseToWeatherData(response: any): WeatherData[] {
    return response.map((data: any) => {
      return {
        ...data,
        date: new Date(data.date),
      }
    })
  }
}
