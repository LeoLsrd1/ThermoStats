import { Component } from '@angular/core'
import { HeaderComponent } from '../../shared/components/header/header.component'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { ChartModule } from 'primeng/chart'
import { DataService, WeatherData } from '../../services/data.service'
import { SelectButtonModule } from 'primeng/selectbutton'
import { FormsModule } from '@angular/forms'
import { Button } from 'primeng/button'
import { CardModule } from 'primeng/card'

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    HeaderComponent,
    TranslateModule,
    ChartModule,
    SelectButtonModule,
    FormsModule,
    Button,
    CardModule,
  ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent {
  chartData: WeatherData[] = []
  yearData: WeatherData[] = []

  today: Date = new Date()
  currentMonth: number = this.today.getMonth()
  currentYear: number = this.today.getFullYear()
  selectedYear: number = this.currentYear
  selectedMonth: number = this.currentMonth

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
    this.dataService.getLastYearData().subscribe((data) => {
      this.chartData = data
      this.onSelectionchange()
    })
  }

  onSelectionchange() {
    switch (this.selectedOption) {
      case 'day':
        const currentMonth = new Date(
          this.selectedYear,
          this.selectedMonth + 1,
          0
        )
        const monthStart = new Date(currentMonth)
        monthStart.setDate(1)
        console.log(currentMonth, monthStart)
        const lastMonthData = this.chartData.filter(
          (entry) => entry.date >= monthStart && entry.date <= currentMonth
        )
        this.displayData = this.dataService.weatherDataToChartData(
          lastMonthData,
          this.selectedOption,
          monthStart
        )
        break
      case 'month':
        this.displayData = this.dataService.weatherDataToChartData(
          this.calculateMonthlyAverages(this.chartData),
          this.selectedOption,
          this.selectedYear.toString()
        )
        break
      case 'year':
        if (this.yearData.length === 0) {
          this.dataService.getData().subscribe((data) => {
            this.yearData = data
            this.displayData = this.dataService.weatherDataToChartData(
              this.calculateYearlyAverages(this.yearData),
              this.selectedOption
            )
          })
        } else {
          this.displayData = this.dataService.weatherDataToChartData(
            this.calculateYearlyAverages(this.yearData),
            this.selectedOption
          )
        }
        break
    }
  }

  calculateMonthlyAverages(data: WeatherData[]): WeatherData[] {
    const monthlyData: { [key: string]: any } = {}

    // Parcourir chaque entrée et grouper par mois
    data.forEach((entry) => {
      const date = entry.date
      if (date.getFullYear() < this.selectedYear) {
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
        wind: monthlyData[month].totalWind
          ? monthlyData[month].totalWind / monthlyData[month].count
          : undefined,
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
        wind: yearlyData[year].totalWind
          ? yearlyData[year].totalWind / yearlyData[year].count
          : undefined,
      })
    }

    return averages
  }

  onPrevious() {
    if (this.selectedOption === 'day') {
      if (this.selectedMonth <= 0) {
        this.selectedMonth = 11
        this.selectedYear--
        this.dataService.getDataByYear(this.selectedYear).subscribe((data) => {
          this.chartData = data
          this.onSelectionchange()
        })
      } else {
        this.selectedMonth--
        this.onSelectionchange()
      }
    } else {
      this.selectedYear--
      this.dataService.getDataByYear(this.selectedYear).subscribe((data) => {
        this.chartData = data
        this.onSelectionchange()
      })
    }
  }

  onNext() {
    if (this.selectedOption === 'day') {
      if (this.selectedMonth === 11) {
        this.selectedMonth = 0
        this.selectedYear++
        this.dataService.getDataByYear(this.selectedYear).subscribe((data) => {
          this.chartData = data
          this.onSelectionchange()
        })
      } else {
        this.selectedMonth++
        this.onSelectionchange()
      }
    } else {
      this.selectedYear++
      this.dataService.getDataByYear(this.selectedYear).subscribe((data) => {
        this.chartData = data
        this.onSelectionchange()
      })
    }
  }

  isNextDisabled() {
    if (this.selectedOption === 'day') {
      return (
        this.selectedYear >= this.currentYear &&
        this.selectedMonth >= this.currentMonth
      )
    } else {
      return this.selectedYear >= this.currentYear
    }
  }
}
