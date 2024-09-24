import { Routes } from '@angular/router'
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { AddComponent } from './pages/add/add.component'
import { ChartComponent } from './pages/chart/chart.component'

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'add',
    component: AddComponent,
  },
  {
    path: 'chart',
    component: ChartComponent,
  },
]
