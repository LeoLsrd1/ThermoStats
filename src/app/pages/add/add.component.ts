import { Component } from '@angular/core'
import { HeaderComponent } from '../../shared/components/header/header.component'
import { TranslateModule } from '@ngx-translate/core'
import { InputTextModule } from 'primeng/inputtext'
import { KeyFilterModule } from 'primeng/keyfilter'
import { CalendarModule } from 'primeng/calendar'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { DataService } from '../../services/data.service'
import { catchError, of } from 'rxjs'
import { ToggleButtonModule } from 'primeng/togglebutton'

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    HeaderComponent,
    TranslateModule,
    InputTextModule,
    KeyFilterModule,
    CalendarModule,
    FormsModule,
    ToggleButtonModule,
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css',
})
export class AddComponent {
  inputRegex: RegExp = /^-?\d+([.,]\d+)?$/

  today: Date = new Date()
  date: Date = new Date()
  minTemp: number | undefined
  maxTemp: number | undefined
  rain: number | undefined
  wind: number | undefined

  loading: boolean = false
  hasError: boolean = false

  isMinTempNegative: boolean = false
  isMaxTempNegative: boolean = false

  constructor(
    private router: Router,
    private dataService: DataService
  ) {
    this.getDateData()
  }

  save() {
    this.postData().subscribe((response) => {
      if (response) {
        this.loading = false
        this.router.navigateByUrl('/').then()
      }
    })
  }

  getDateData() {
    this.dataService.getDataByDate(this.date).subscribe((data) => {
      if (data?.length > 0) {
        this.minTemp = data[0].minTemp
        this.maxTemp = data[0].maxTemp
        this.rain = data[0].rain
        this.wind = data[0].wind
      } else {
        this.minTemp = undefined
        this.maxTemp = undefined
        this.rain = undefined
        this.wind = undefined
      }
    })
  }

  postData() {
    this.loading = true
    return this.dataService
      .postData({
        date: this.date,
        minTemp: this.minTemp,
        maxTemp: this.maxTemp,
        rain: this.rain,
        wind: this.wind,
      })
      .pipe(
        catchError((error) => {
          this.hasError = true
          this.loading = false
          console.error('Error:', error)
          return of(null)
        })
      )
  }

  toggleNegative(type: 'min' | 'max') {
    if (type === 'min') {
      this.minTemp = this.isMinTempNegative
        ? -Math.abs(this.minTemp || 0)
        : Math.abs(this.minTemp || 0)
    } else if (type === 'max') {
      this.maxTemp = this.isMaxTempNegative
        ? -Math.abs(this.maxTemp || 0)
        : Math.abs(this.maxTemp || 0)
    }
  }

  onTempChange(type: 'min' | 'max') {
    if (type === 'min' && this.minTemp !== undefined) {
      if (this.isMinTempNegative) {
        this.minTemp = -Math.abs(parseFloat(this.minTemp.toString()))
      } else {
        this.minTemp = Math.abs(parseFloat(this.minTemp.toString()))
      }
    } else if (type === 'max' && this.maxTemp !== undefined) {
      if (this.isMaxTempNegative) {
        this.maxTemp = -Math.abs(parseFloat(this.maxTemp.toString()))
      } else {
        this.maxTemp = Math.abs(parseFloat(this.maxTemp.toString()))
      }
    }
  }
}
