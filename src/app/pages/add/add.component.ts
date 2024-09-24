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
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css',
})
export class AddComponent {
  today: Date = new Date()
  date: Date = new Date()
  minTemp: number | undefined
  maxTemp: number | undefined
  rain: number | undefined
  wind: number | undefined

  loading: boolean = false
  hasError: boolean = false

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
}
