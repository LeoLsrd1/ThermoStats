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
  weekData: WeatherData[] = []
  monthData: WeatherData[] = []
  yearData: WeatherData[] = []

  displayData: any
  chartOptions: any
  chartSelection: any[] = []
  selectedOption = 'day'

  constructor(
    private dataService: DataService,
    private translateService: TranslateService
  ) {
    this.chartSelection = [
      { label: this.translateService.instant('day'), value: 'day' },
      { label: this.translateService.instant('week'), value: 'week' },
      { label: this.translateService.instant('month'), value: 'month' },
      { label: this.translateService.instant('year'), value: 'year' },
    ]
    this.chartOptions = this.dataService.chartOptions
    this.dataService.getData().subscribe((data) => {
      this.chartData = data
      this.displayData = this.dataService.weatherDataToChartData(data)
    })
  }

  protected readonly onselectionchange = onselectionchange

  onSelectionchange() {
    switch (this.selectedOption) {
      case 'day':
        this.displayData = this.dataService.weatherDataToChartData(
          this.chartData
        )
        break
      case 'week':
        if (this.weekData.length === 0) {
          this.weekData = this.calculateWeeklyAverages(this.chartData)
        }
        this.displayData = this.dataService.weatherDataToChartData(
          this.weekData
        )
        break
      case 'month':
        if (this.monthData.length === 0) {
          this.monthData = this.calculateMonthlyAverages(this.chartData)
        }
        this.displayData = this.dataService.weatherDataToChartData(
          this.monthData
        )
        break
      case 'year':
        if (this.yearData.length === 0) {
          this.yearData = this.calculateYearlyAverages(this.chartData)
        }
        this.displayData = this.dataService.weatherDataToChartData(
          this.yearData
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

  calculateWeeklyAverages(data: WeatherData[]): WeatherData[] {
    const weeklyData: { [key: string]: any } = {}
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    // Parcourir chaque entrée et grouper par semaine
    data.forEach((entry) => {
      if (entry.date < oneYearAgo) {
        return
      }
      const week = this.getWeekNumber(entry.date)

      // Si la semaine n'existe pas encore, l'initialiser
      if (!weeklyData[week]) {
        weeklyData[week] = {
          totalMaxTemp: 0,
          totalMinTemp: 0,
          totalRain: 0,
          totalWind: 0,
          count: 0,
        }
      }

      // Accumuler les valeurs
      weeklyData[week].totalMaxTemp += entry.maxTemp
      weeklyData[week].totalMinTemp += entry.minTemp
      weeklyData[week].totalRain += entry.rain
      weeklyData[week].totalWind += entry.wind
      weeklyData[week].count += 1 // Incrémenter le compteur
    })

    // Calculer les moyennes
    const averages: WeatherData[] = []
    for (const week in weeklyData) {
      const [year, weekNumber] = week.split('-').map(Number)
      averages.push({
        date: this.getDateOfISOWeek(weekNumber, year),
        maxTemp: weeklyData[week].totalMaxTemp / weeklyData[week].count,
        minTemp: weeklyData[week].totalMinTemp / weeklyData[week].count,
        rain: weeklyData[week].totalRain,
        wind: weeklyData[week].totalWind / weeklyData[week].count,
      })
    }

    return averages
  }

  getWeekNumber(date: Date): string {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000
    const weekNumber = Math.ceil(
      (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
    )
    return `${date.getFullYear()}-${weekNumber}`
  }

  getDateOfISOWeek(week: number, year: number): Date {
    const simple = new Date(year, 0, 1 + (week - 1) * 7)
    const dow = simple.getDay()
    const ISOweekStart = simple
    if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
    else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
    return ISOweekStart
  }
}
