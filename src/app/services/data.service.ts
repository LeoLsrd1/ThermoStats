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

  private dataResponseToWeatherData(response: any): WeatherData[] {
    return response.map((data: any) => {
      return {
        ...data,
        date: new Date(data.date),
      }
    })
  }

  weatherDataToChartData(data: WeatherData[]): any {
    return {
      labels: data.map((data) => data.date.toDateString()),
      datasets: [
        {
          label: 'Min Temp',
          data: data.map((data) => data.minTemp),
          fill: false,
          borderColor: '#42A5F5',
        },
        {
          label: 'Max Temp',
          data: data.map((data) => data.maxTemp),
          fill: false,
          borderColor: '#FFA726',
        },
        {
          label: 'Rain',
          data: data.map((data) => data.rain),
          fill: false,
          borderColor: '#66BB6A',
        },
        {
          label: 'Wind',
          data: data.map((data) => data.wind),
          fill: false,
          borderColor: '#EF5350',
        },
      ],
    }
  }
}
