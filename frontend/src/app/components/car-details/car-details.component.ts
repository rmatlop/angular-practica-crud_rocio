import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StateMielagePipe } from '../../pipes/state-mielage.pipe';
import { CarButtonDirective } from '../../shared/directives/car-button.directive';
import { CarDetailsDto } from '../../shared/interfaces/car-details-dto.interface';
import { Car } from '../../shared/interfaces/car.interface';
import { CarsService } from '../../shared/services/cars.service';

@Component({
  selector: 'app-car-details',
  imports: [CarButtonDirective, CommonModule, StateMielagePipe, RouterLink],
  templateUrl: './car-details.component.html',
  styleUrl: './car-details.component.css',
})
export class CarDetailsComponent implements OnInit {
  readonly #carsService = inject(CarsService);
  protected readonly car = signal<Car>({
    brand: '',
    model: '',
    carDetails: [],
    id: '',
    total: 0,
  });
  protected readonly carDetails = signal<CarDetailsDto[]>([]);
  readonly id = input<string>();

  ngOnInit() {
    this.#carsService.getCarById(this.id()!).subscribe({
      next: (response) => {
        this.car.set(response);

        this.carDetails.set(this.car().carDetails);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  setColorTagClass(value: number) {
    return {
      'tag-green': value === 0,
      'tag-blue': value > 0 && value < 100,
      'tag-orange': value >= 100,
    };
  }
}
