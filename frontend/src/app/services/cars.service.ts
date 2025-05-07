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
  readonly #tokenAutorization = 'Bearer ' + localStorage.getItem('auth-token');

  getCars(): Observable<CarSummary[]> {
    return this.#httpClient.get<Car[]>(`${environment.apiUrl}/cars`, {
      headers: {
        Authorization: this.#tokenAutorization,
      },
    });
  }

  getCarById(id: string): Observable<Car[]> {
    return this.#httpClient.get<Car[]>(`${environment.apiUrl}/cars/${id}`, {
      headers: {
        Authorization: this.#tokenAutorization,
      },
    });
  }

  createCar(): Observable<CreateCarDto[]> {
    return this.#httpClient.post<Car[]>(`${environment.apiUrl}/cars`, {
      headers: {
        Authorization: this.#tokenAutorization,
      },
    });
  }

  updateCar(car: Car): Observable<CreateCarDto[]> {
    return this.#httpClient.put<Car[]>(
      `${environment.apiUrl}/cars/${car.id}`,
      car,
      {
        headers: {
          Authorization: this.#tokenAutorization,
        },
      },
    );
  }

  deleteCar(id: string) {
    return this.#httpClient.delete<Car[]>(`${environment.apiUrl}/cars/${id}`, {
      headers: {
        Authorization: this.#tokenAutorization,
      },
    });
  }
}
