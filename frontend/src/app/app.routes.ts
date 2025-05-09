import { Routes } from '@angular/router';
import { CarDetailsComponent } from './components/car-details/car-details.component';
import { CarsCreateComponent } from './pages/cars-create/cars-create.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'cars/create',
    component: CarsCreateComponent,
  },
  {
    path: 'cars/:id',
    component: CarDetailsComponent,
  },
];
