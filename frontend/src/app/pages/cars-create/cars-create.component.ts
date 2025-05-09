import { Component } from '@angular/core';
import { FormCarsCreateComponent } from '../../components/form-cars-create/form-cars-create.component';

@Component({
  selector: 'app-cars-create',
  imports: [FormCarsCreateComponent],
  templateUrl: './cars-create.component.html',
  styleUrl: './cars-create.component.css',
})
export class CarsCreateComponent {}
