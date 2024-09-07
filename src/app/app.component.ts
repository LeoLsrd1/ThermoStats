import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, DashboardComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
    title = 'ThermoStats'

    constructor(private translateService: TranslateService) {
        this.translateService.setDefaultLang('fr')
        this.translateService.use('fr')
    }
}
