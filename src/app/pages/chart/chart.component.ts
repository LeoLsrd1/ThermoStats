import { Component } from '@angular/core'
import { HeaderComponent } from '../../shared/components/header/header.component'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { ChartModule } from 'primeng/chart'
import { DataService, WeatherData } from '../../services/data.service'
import { SelectButtonModule } from 'primeng/selectbutton'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    HeaderComponent,
    TranslateModule,
    ChartModule,
    SelectButtonModule,
    FormsModule,
  ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent {
  chartData: WeatherData[] = []
  monthData: WeatherData[] = []
  yearData: WeatherData[] = []

  displayData: any
  chartOptions: any
  chartSelection: any[] = []
  selectedOption: 'day' | 'month' | 'year' = 'day'

  constructor(
    private dataService: DataService,
    private translateService: TranslateService
  ) {
    this.chartSelection = [
      { label: this.translateService.instant('day'), value: 'day' },
      { label: this.translateService.instant('month'), value: 'month' },
      { label: this.translateService.instant('year'), value: 'year' },
    ]
    this.dataService.chartOptions$.subscribe((options) => {
      this.chartOptions = options
    })
    this.dataService.getData().subscribe((data) => {
      this.chartData = data
      this.displayData = this.dataService.weatherDataToChartData(
        data,
        this.selectedOption
      )
    })
  }

  protected readonly onselectionchange = onselectionchange

  onSelectionchange() {
    switch (this.selectedOption) {
      case 'day':
        this.displayData = this.dataService.weatherDataToChartData(
          this.chartData,
          this.selectedOption
        )
        break
      case 'month':
        if (this.monthData.length === 0) {
          this.monthData = this.calculateMonthlyAverages(this.chartData)
        }
        this.displayData = this.dataService.weatherDataToChartData(
          this.monthData,
          this.selectedOption
        )
        break
      case 'year':
        if (this.yearData.length === 0) {
          this.yearData = this.calculateYearlyAverages(this.chartData)
        }
        this.displayData = this.dataService.weatherDataToChartData(
          this.yearData,
          this.selectedOption
        )
        break
    }
  }

  calculateMonthlyAverages(data: WeatherData[]): WeatherData[] {
    const monthlyData: { [key: string]: any } = {}
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    // Parcourir chaque entrée et grouper par mois
    data.forEach((entry) => {
      const date = entry.date
      if (date < oneYearAgo) {
        return
      }
      const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}` // Format "YYYY-MM"

      // Si le mois n'existe pas encore, l'initialiser
      if (!monthlyData[yearMonth]) {
        monthlyData[yearMonth] = {
          totalMaxTemp: 0,
          totalMinTemp: 0,
          totalRain: 0,
          totalWind: 0,
          count: 0,
        }
      }

      // Accumuler les valeurs
      monthlyData[yearMonth].totalMaxTemp += entry.maxTemp
      monthlyData[yearMonth].totalMinTemp += entry.minTemp
      monthlyData[yearMonth].totalRain += entry.rain
      monthlyData[yearMonth].totalWind += entry.wind
      monthlyData[yearMonth].count += 1 // Incrémenter le compteur
    })

    // Calculer les moyennes
    const averages: WeatherData[] = []
    for (const month in monthlyData) {
      const [year, monthStr] = month.split('-').map(Number)
      averages.push({
        date: new Date(year, monthStr - 1),
        maxTemp: monthlyData[month].totalMaxTemp / monthlyData[month].count,
        minTemp: monthlyData[month].totalMinTemp / monthlyData[month].count,
        rain: monthlyData[month].totalRain,
        wind: monthlyData[month].totalWind / monthlyData[month].count,
      })
    }

    return averages
  }

  calculateYearlyAverages(data: WeatherData[]): WeatherData[] {
    const yearlyData: { [key: string]: any } = {}

    // Parcourir chaque entrée et grouper par année
    data.forEach((entry) => {
      const year = entry.date.getFullYear()

      // Si l'année n'existe pas encore, l'initialiser
      if (!yearlyData[year]) {
        yearlyData[year] = {
          totalMaxTemp: 0,
          totalMinTemp: 0,
          totalRain: 0,
          totalWind: 0,
          count: 0,
        }
      }

      // Accumuler les valeurs
      yearlyData[year].totalMaxTemp += entry.maxTemp
      yearlyData[year].totalMinTemp += entry.minTemp
      yearlyData[year].totalRain += entry.rain
      yearlyData[year].totalWind += entry.wind
      yearlyData[year].count += 1 // Incrémenter le compteur
    })

    // Calculer les moyennes
    const averages: WeatherData[] = []
    for (const year in yearlyData) {
      averages.push({
        date: new Date(Number(year), 0), // Créer une date avec l'année
        maxTemp: yearlyData[year].totalMaxTemp / yearlyData[year].count,
        minTemp: yearlyData[year].totalMinTemp / yearlyData[year].count,
        rain: yearlyData[year].totalRain,
        wind: yearlyData[year].totalWind / yearlyData[year].count,
      })
    }

    return averages
  }
}
