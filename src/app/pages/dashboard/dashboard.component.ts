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
    this.chartOptions = this.dataService.chartOptions
    this.getData()
  }

  getData() {
    this.dataService.getData().subscribe((data) => {
      this.weatherData = data
      this.chartData = this.dataService.weatherDataToChartData(data)
    })
    this.dataService.getLastWeekData().subscribe((data) => {
      this.maxTemp = Math.max(
        ...data.map((data) => data.maxTemp).filter((temp) => temp !== undefined)
      )
      this.minTemp = Math.min(
        ...data.map((data) => data.minTemp).filter((temp) => temp !== undefined)
      )
      this.rain = data
        .map((data) => data.rain)
        .filter((rain) => rain !== undefined)
        .reduce((acc, rain) => acc + rain, 0)
      this.wind = Math.max(
        ...data.map((data) => data.wind).filter((wind) => wind !== undefined)
      )
    })
  }
}
