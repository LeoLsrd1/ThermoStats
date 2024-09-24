import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
import { Button } from 'primeng/button'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [Button],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Input() title: string = 'App Title'
  @Input() route: string = ''
  @Input() hasBackButton: boolean = false

  constructor(private router: Router) {}

  goBack() {
    this.router.navigateByUrl('/').then()
  }
}
