import { Injectable } from '@angular/core'
import { SwPush } from '@angular/service-worker'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs'

/**
 * Service to handle push notifications.
 */
@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  private readonly VAPID_PUBLIC_KEY = environment.vapidPublicKey
  private readonly SUBSCRIBE_API_URL = environment.apiUrl + '/subscribe'

  constructor(
    private swPush: SwPush,
    private http: HttpClient
  ) {}

  /**
   * Checks if push notifications are supported and enabled.
   * @returns {boolean} - True if push notifications are supported and enabled, false otherwise.
   */
  checkPushSupport(): boolean {
    if (!this.swPush.isEnabled) {
      console.warn(
        'Push notifications are not enabled or not supported by this browser.'
      )
      return false
    }
    return true
  }

  /**
   * Subscribes the user to push notifications.
   */
  subscribeToNotifications(): void {
    if (!this.checkPushSupport()) {
      return
    }

    this.swPush.subscription.subscribe((subscription) => {
      if (subscription) {
        console.log('User is already subscribed')
        return
      }

      this.swPush
        .requestSubscription({
          serverPublicKey: this.VAPID_PUBLIC_KEY,
        })
        .then((subscription) => {
          console.log('Subscription successful!', subscription)

          // Envoyer l'abonnement au backend
          this.sendSubscriptionToServer(subscription).subscribe(
            () => console.log('Subscription sent to the server successfully.'),
            (error) =>
              console.error(
                'Error while sending subscription to the server:',
                error
              )
          )
        })
        .catch((err) => {
          console.error('Error during push notification subscription:', err)
        })
    })
  }

  /**
   * Sends the subscription object to the server.
   * @param subscription - The push subscription object.
   * @returns {Observable<any>} - Observable for the HTTP POST request.
   */
  private sendSubscriptionToServer(
    subscription: PushSubscription
  ): Observable<any> {
    return this.http.post(this.SUBSCRIBE_API_URL, subscription)
  }

  /**
   * Listens for incoming push notifications and notification clicks.
   */
  listenToPushNotifications(): void {
    if (!this.checkPushSupport()) {
      return
    }

    this.swPush.messages.subscribe((message) => {
      console.log('Push notification received:', message)
      this.showNotification(message)
    })

    this.swPush.notificationClicks.subscribe((event) => {
      console.log('Notification clicked:', event.notification)
    })
  }

  private showNotification(message: any): void {
    const title = message.title || 'Thermostats'
    const options = {
      body: message.body || 'Psst',
      icon: message.icon || '/icons/apple-touch-icon-152x152.png',
    }
    new Notification(title, options)
  }
}
