import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarsService } from '../../services/cars.service';
import { CarButtonDirective } from '../../shared/directives/car-button.directive';
import { CarSummary } from '../../shared/interfaces/car-summary.interface';

@Component({
  selector: 'app-table',
  imports: [
    RouterLink,
    CarButtonDirective,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent implements OnInit {
  readonly #carsService = inject(CarsService);
  protected readonly cars = signal<CarSummary[]>([]);

  ngOnInit() {
    this.#carsService.getCars().subscribe({
      next: (response) => {
        this.cars.set(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
