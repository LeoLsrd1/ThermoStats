import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs'
import { environment } from '../../environments/environment'
import { TranslateService } from '@ngx-translate/core'

/**
 * Type definition for weather data.
 */
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

  /** Observable for chart options. */
  chartOptions$: Observable<any>
  /** Subject for chart title. */
  chartTitleSubject = new BehaviorSubject<string>('')

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
      }),
      switchMap(() => this.chartTitleSubject),
      map((chartTitle) => {
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
          plugins: {
            legend: {
              position: 'bottom',
            },
            title: {
              display: true,
              text: chartTitle,
            },
          },
        }
      })
    )
  }

  /**
   * Fetches weather data.
   * @returns Observable of WeatherData array.
   */
  getData(): Observable<WeatherData[]> {
    return this.http
      .get<WeatherData[]>(this.apiUrl)
      .pipe(map((response) => this.dataResponseToWeatherData(response)))
  }

  /**
   * Fetches weather data for the last year.
   * @returns Observable of WeatherData array.
   */
  getLastYearData(): Observable<WeatherData[]> {
    return this.http
      .get<WeatherData>(`${this.apiUrl}/lastYear`)
      .pipe(map((response) => this.dataResponseToWeatherData(response)))
  }

  /**
   * Fetches weather data for the last month.
   * @returns Observable of WeatherData array.
   */
  getLastMonthData(): Observable<WeatherData[]> {
    return this.http
      .get<WeatherData>(`${this.apiUrl}/lastMonth`)
      .pipe(map((response) => this.dataResponseToWeatherData(response)))
  }

  /**
   * Fetches weather data for the last week.
   * @returns Observable of WeatherData array.
   */
  getLastWeekData(): Observable<WeatherData[]> {
    return this.http
      .get<WeatherData>(`${this.apiUrl}/last7days`)
      .pipe(map((response) => this.dataResponseToWeatherData(response)))
  }

  /**
   * Fetches weather data for a specific year.
   * @param year - The year for which to fetch data.
   * @returns Observable of WeatherData array.
   */
  getDataByYear(year: number): Observable<WeatherData[]> {
    return this.http
      .get<WeatherData[]>(`${this.apiUrl}/year/${year}`)
      .pipe(map((response) => this.dataResponseToWeatherData(response)))
  }

  /**
   * Fetches weather data for a specific date.
   * @param date - The date for which to fetch data.
   * @returns Observable of WeatherData array.
   */
  getDataByDate(date: Date): Observable<WeatherData[]> {
    const selectedDate = this.dateToString(date) // Formate la date en 'YYYY-MM-DD'
    return this.http
      .get<WeatherData[]>(`${this.apiUrl}/date/${selectedDate}`)
      .pipe(map((response) => this.dataResponseToWeatherData(response)))
  }

  /**
   * Posts weather data.
   * @param data - The weather data to post.
   * @returns Observable of the HTTP response.
   */
  postData(data: WeatherData): Observable<any> {
    const postData = {
      ...data,
      date: this.dateToString(data.date),
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    console.log('Post Data:', postData)
    return this.http.post<any>(this.apiUrl, postData, { headers })
  }

  /**
   * Converts the API response to WeatherData array.
   * @param response - The API response.
   * @returns Array of WeatherData.
   */
  private dataResponseToWeatherData(response: any): WeatherData[] {
    return response.map((data: any) => {
      return {
        ...data,
        date: new Date(data.date),
      }
    })
  }

  /**
   * Converts weather data to chart data.
   * @param data - The weather data.
   * @param filter - The filter type ('day', 'month', 'year').
   * @param title - The date or string for the chart title.
   * @returns Chart data object.
   */
  weatherDataToChartData(
    data: WeatherData[],
    filter: 'day' | 'month' | 'year',
    title: Date | string = ''
  ): any {
    if (typeof title === 'string') {
      this.chartTitleSubject.next(title)
    }
    let labels: string[] = []
    switch (filter) {
      case 'day':
        if (typeof title !== 'string') {
          this.translateService
            .get('primeng.monthNames')
            .subscribe((months) =>
              this.chartTitleSubject.next(
                `${months[title.getMonth()]} ${title.getFullYear()}`
              )
            )
        }
        labels = data.map((data) => data.date.getDate().toString())
        break
      case 'month':
        if (typeof title !== 'string') {
          this.chartTitleSubject.next(title.getFullYear().toString())
        }
        labels = data.map((data) => (data.date.getMonth() + 1).toString())
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

  /**
   * Converts a Date object to a string in 'YYYY-MM-DD' format.
   * @param date - The date to convert.
   * @returns The formatted date string.
   */
  private dateToString(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }
}
