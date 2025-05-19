import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  readonly #httpClient = inject(HttpClient);

  getBrands(): Observable<string[]> {
    return this.#httpClient.get<string[]>(`${environment.apiUrl}/brands`);
  }

  getModelByBrand(brandId: string) {
    return this.#httpClient.get<string[]>(
      `${environment.apiUrl}/brands/${brandId}/models`,
    );
  }
}
