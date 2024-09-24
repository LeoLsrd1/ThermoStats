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

  constructor(private dataService: DataService) {
    this.getData()
  }

  getData() {
    this.dataService.getData().subscribe((data) => {
      this.weatherData = data
      this.chartData = this.dataService.weatherDataToChartData(data)
    })
    this.dataService.getLastWeekData().subscribe((data) => {
      this.maxTemp = Math.max(...data.map((data) => data.maxTemp))
      this.minTemp = Math.min(...data.map((data) => data.minTemp))
      this.rain = data.reduce((acc, data) => acc + data.rain, 0)
      this.wind = Math.max(...data.map((data) => data.wind))
    })
  }
}
