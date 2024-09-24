import { Component } from '@angular/core'
import { HeaderComponent } from '../../shared/components/header/header.component'
import { Button } from 'primeng/button'
import { RouterLink } from '@angular/router'
import { DataService, WeatherData } from '../../services/data.service'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, Button, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  data: WeatherData[] = []

  constructor(private dataService: DataService) {
    this.getData()
  }

  getData() {
    this.dataService.getData().subscribe((data) => {
      this.data = data
    })
  }
}
