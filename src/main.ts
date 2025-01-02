import { bootstrapApplication } from '@angular/platform-browser'
import { appConfig } from './app.config'
import { AppComponent } from './app/app.component'
import { environment } from './environments/environment'

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err))

if ('serviceWorker' in navigator && environment.production) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/ngsw-worker.js')
      .then((registration) => {
        console.log(
          'Service Worker registered with scope: ',
          registration.scope
        )
      })
      .catch((error) => {
        console.error('Service Worker registration failed: ', error)
      })
  })
}
