import { Component } from '@angular/core'
import { HeaderComponent } from '../../shared/components/header/header.component'
import { Button } from 'primeng/button'
import { RouterLink } from '@angular/router'
import { DataService, WeatherData } from '../../services/data.service'
import { CardModule } from 'primeng/card'
import { ChartModule } from 'primeng/chart'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, Button, RouterLink, CardModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  weatherData: WeatherData[] = []
  chartData: any

  constructor(private dataService: DataService) {
    this.getData()
  }

  getData() {
    this.dataService.getData().subscribe((data) => {
      this.weatherData = data
      this.chartData = this.dataService.weatherDataToChartData(data)
    })
  }
}
