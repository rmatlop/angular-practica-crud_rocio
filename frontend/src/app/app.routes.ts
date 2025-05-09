import { Routes } from '@angular/router';
import { CarDetailsComponent } from './components/car-details/car-details.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'cars/:id',
    component: CarDetailsComponent,
  },
];
