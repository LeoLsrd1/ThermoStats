import { Component, OnInit } from '@angular/core'
import { HeaderComponent } from '../../shared/components/header/header.component'
import { TranslateModule } from '@ngx-translate/core'
import { InputTextModule } from 'primeng/inputtext'
import { KeyFilterModule } from 'primeng/keyfilter'
import { CalendarModule } from 'primeng/calendar'
import { FormsModule } from '@angular/forms'

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
export class AddComponent implements OnInit {
    today: Date = new Date()
  //TODO: fix maxDate
    date: Date | undefined
    minTemp: number | undefined
    maxTemp: number | undefined
    rain: number | undefined
    wind: number | undefined

    ngOnInit() {
    }
}
