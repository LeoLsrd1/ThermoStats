import { Component, OnInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { TranslateService } from '@ngx-translate/core'
import { PrimeNGConfig } from 'primeng/api'
import { SwUpdate, VersionEvent } from '@angular/service-worker'
import { map, of, switchMap } from 'rxjs'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'ThermoStats'

  constructor(
    private translateService: TranslateService,
    private config: PrimeNGConfig,
    private swUpdate: SwUpdate
  ) {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(
          switchMap((event: VersionEvent) => {
            if (event.type === 'VERSION_READY') {
              return this.translateService.get('update')
            } else {
              return of('')
            }
          }),
          map((updateMessage) => {
            if (updateMessage !== '') {
              if (confirm(updateMessage)) {
                window.location.reload()
              }
            }
          })
        )
        .subscribe()
    }
  }

  ngOnInit() {
    this.setSystemLanguage()
  }

  setSystemLanguage() {
    const lang = navigator.language.split('-')[0]
    console.log('System language:', lang)
    this.translateService.setDefaultLang(lang)
    this.translateService.use(lang)
    this.translateService.get('primeng').subscribe((res) => {
      this.config.setTranslation(res)
    })
  }

  translateTo(lang: string) {
    this.translateService.use(lang)
    this.translateService.get('primeng').subscribe((res) => {
      this.config.setTranslation(res)
    })
  }
}
