import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { map, Observable } from 'rxjs'
import { environment } from '../../environments/environment'

export type WeatherData = {
  date: Date
  minTemp?: number
  maxTemp?: number
  rain?: number
  wind?: number
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

  getLastWeekData(): Observable<WeatherData[]> {
    return this.http
      .get<WeatherData>(`${this.apiUrl}/last7days`)
      .pipe(map((response) => this.dataResponseToWeatherData(response)))
  }

  getDataByDate(date: Date): Observable<WeatherData[]> {
    const selectedDate = this.dateToString(date) // Formate la date en 'YYYY-MM-DD'
    return this.http
      .get<WeatherData[]>(`${this.apiUrl}/date/${selectedDate}`)
      .pipe(map((response) => this.dataResponseToWeatherData(response)))
  }

  postData(data: WeatherData): Observable<any> {
    const roundIfDefined = (value?: number) =>
      value !== undefined ? Math.floor(value) : undefined
    const postData = {
      date: this.dateToString(data.date),
      minTemp: roundIfDefined(data.minTemp),
      maxTemp: roundIfDefined(data.maxTemp),
      rain: roundIfDefined(data.rain),
      wind: roundIfDefined(data.wind),
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    console.log('Post Data:', postData)
    return this.http.post<any>(this.apiUrl, postData, { headers })
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
      labels: data.map((data) => data.date.toLocaleDateString()),
      datasets: [
        {
          label: 'Min Temp',
          data: data.map((data) => data.minTemp),
        },
        {
          label: 'Max Temp',
          data: data.map((data) => data.maxTemp),
        },
        {
          label: 'Rain',
          data: data.map((data) => data.rain),
        },
        {
          label: 'Wind',
          data: data.map((data) => data.wind),
        },
      ],
    }
  }

  private dateToString(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }
}
