import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CarSummary } from '../shared/interfaces/car-summary.interface';
import { Car } from '../shared/interfaces/car.interface';
import { CreateCarDto } from '../shared/interfaces/create-car-dto.interface';

@Injectable({
  providedIn: 'root',
})
export class CarsService {
  readonly #httpClient = inject(HttpClient);

  getCars() {
    return this.#httpClient.get<CarSummary[]>(`${environment.apiUrl}/cars`);
  }

  getCarById(id: string): Observable<Car> {
    return this.#httpClient.get<Car>(`${environment.apiUrl}/cars/${id}`);
  }

  createCar(car: CreateCarDto): Observable<CreateCarDto> {
    return this.#httpClient.post<CreateCarDto>(
      `${environment.apiUrl}/cars`,
      car,
    );
  }

  updateCar(car: Car): Observable<CreateCarDto[]> {
    return this.#httpClient.put<Car[]>(
      `${environment.apiUrl}/cars/${car.id}`,
      car,
    );
  }

  deleteCar(id: string) {
    return this.#httpClient.delete<Car[]>(`${environment.apiUrl}/cars/${id}`);
  }
}
