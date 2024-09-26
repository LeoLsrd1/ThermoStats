import { Component } from '@angular/core'
import { HeaderComponent } from '../../shared/components/header/header.component'
import { Button } from 'primeng/button'
import { RouterLink } from '@angular/router'
import { DataService, WeatherData } from '../../services/data.service'
import { CardModule } from 'primeng/card'
import { ChartModule } from 'primeng/chart'
import { TranslateModule } from '@ngx-translate/core'
import { StyleClassModule } from 'primeng/styleclass'
import { NgOptimizedImage } from '@angular/common'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HeaderComponent,
    Button,
    RouterLink,
    CardModule,
    ChartModule,
    TranslateModule,
    StyleClassModule,
    NgOptimizedImage,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  weatherData: WeatherData[] = []
  maxTemp!: number
  minTemp!: number
  rain!: number
  wind!: number
  chartData: any
  chartOptions: any

  constructor(private dataService: DataService) {
    this.dataService.chartOptions$.subscribe((options) => {
      this.chartOptions = options
    })
    this.getData()
  }

  getData() {
    this.dataService.getLastMonthData().subscribe((data) => {
      this.weatherData = data
      this.chartData = this.dataService.weatherDataToChartData(data, 'day')
    })
    this.dataService.getLastWeekData().subscribe((data) => {
      this.maxTemp = parseFloat(
        Math.max(
          ...data
            .map((data) => data.maxTemp)
            .filter((temp) => temp !== undefined)
        ).toFixed(1)
      )
      this.minTemp = parseFloat(
        Math.min(
          ...data
            .map((data) => data.minTemp)
            .filter((temp) => temp !== undefined)
        ).toFixed(1)
      )
      this.rain = parseFloat(
        data
          .map((data) => data.rain)
          .filter((rain) => rain !== undefined)
          .reduce((acc, rain) => acc + rain, 0)
          .toFixed(1)
      )
      this.wind = parseFloat(
        Math.max(
          ...data.map((data) => data.wind).filter((wind) => wind !== undefined)
        ).toFixed(1)
      )
    })
  }
}
