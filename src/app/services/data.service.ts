import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { map, Observable, switchMap } from 'rxjs'
import { environment } from '../../environments/environment'
import { TranslateService } from '@ngx-translate/core'

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

  chartOptions$: Observable<any>

  private yAxis!: string
  private y1Axis!: string

  constructor(
    private http: HttpClient,
    private translateService: TranslateService
  ) {
    this.chartOptions$ = this.translateService.get('y-axis').pipe(
      switchMap((yAxis) => {
        this.yAxis = yAxis
        return this.translateService.get('y1-axis')
      }),
      map((y1Axis) => {
        this.y1Axis = y1Axis
        return {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: this.yAxis,
              },
            },
            y1: {
              position: 'right',
              beginAtZero: true,
              title: {
                display: true,
                text: this.y1Axis,
              },
              grid: {
                display: false,
              },
            },
          },
        }
      })
    )
  }

  getData(): Observable<WeatherData[]> {
    return this.http
      .get<WeatherData[]>(this.apiUrl)
      .pipe(map((response) => this.dataResponseToWeatherData(response)))
  }

  getLastYearData(): Observable<WeatherData[]> {
    return this.http
      .get<WeatherData>(`${this.apiUrl}/lastYear`)
      .pipe(map((response) => this.dataResponseToWeatherData(response)))
  }

  getLastMonthData(): Observable<WeatherData[]> {
    return this.http
      .get<WeatherData>(`${this.apiUrl}/lastMonth`)
      .pipe(map((response) => this.dataResponseToWeatherData(response)))
  }

  getLastWeekData(): Observable<WeatherData[]> {
    return this.http
      .get<WeatherData>(`${this.apiUrl}/last7days`)
      .pipe(map((response) => this.dataResponseToWeatherData(response)))
  }

  getDataByYear(year: number): Observable<WeatherData[]> {
    return this.http
      .get<WeatherData[]>(`${this.apiUrl}/year/${year}`)
      .pipe(map((response) => this.dataResponseToWeatherData(response)))
  }

  getDataByDate(date: Date): Observable<WeatherData[]> {
    const selectedDate = this.dateToString(date) // Formate la date en 'YYYY-MM-DD'
    return this.http
      .get<WeatherData[]>(`${this.apiUrl}/date/${selectedDate}`)
      .pipe(map((response) => this.dataResponseToWeatherData(response)))
  }

  postData(data: WeatherData): Observable<any> {
    const postData = {
      ...data,
      date: this.dateToString(data.date),
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

  weatherDataToChartData(
    data: WeatherData[],
    filter: 'day' | 'month' | 'year'
  ): any {
    let labels: string[] = []
    switch (filter) {
      case 'day':
        labels = data.map((data) => data.date.toLocaleDateString())
        break
      case 'month':
        labels = data.map(
          (data) => `${data.date.getFullYear()}-${data.date.getMonth() + 1}`
        )
        break
      case 'year':
        labels = data.map((data) => data.date.getFullYear().toString())
        break
    }
    return {
      labels: labels,
      datasets: [
        {
          type: 'line',
          label: this.translateService.instant('min'),
          data: data.map((data) => data.minTemp),
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: this.translateService.instant('max'),
          data: data.map((data) => data.maxTemp),
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: this.translateService.instant('wind'),
          data: data.map((data) => data.wind),
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          type: 'bar',
          label: this.translateService.instant('rain'),
          data: data.map((data) => data.rain),
          yAxisID: 'y1',
        },
      ],
    }
  }

  private dateToString(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }
}
