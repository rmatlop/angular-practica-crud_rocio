import { Component, input } from '@angular/core';
import { CarsFormComponent } from '../../shared/components/cars-form/cars-form.component';

@Component({
  selector: 'app-cars-edit',
  imports: [CarsFormComponent],
  templateUrl: './cars-edit.component.html',
  styleUrl: './cars-edit.component.css',
})
export class CarsEditComponent {
  readonly id = input<string>('');
}
