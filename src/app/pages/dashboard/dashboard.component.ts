import { Component } from '@angular/core'
import { HeaderComponent } from '../../shared/components/header/header.component'
import { Button } from 'primeng/button'
import { RouterLink } from '@angular/router'

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [HeaderComponent, Button, RouterLink],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
