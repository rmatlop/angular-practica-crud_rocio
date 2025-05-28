import { Component } from '@angular/core';
import { CarsFormComponent } from '../../shared/components/cars-form/cars-form.component';

@Component({
  selector: 'app-cars-create',
  imports: [CarsFormComponent],
  templateUrl: './cars-create.component.html',
  styleUrl: './cars-create.component.css',
})
export class CarsCreateComponent {}
