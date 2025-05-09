import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrandsService } from '../../services/brands.service';

@Component({
  selector: 'app-form-cars-create',
  imports: [ReactiveFormsModule],
  templateUrl: './form-cars-create.component.html',
  styleUrl: './form-cars-create.component.css',
})
export class FormCarsCreateComponent implements OnInit {
  readonly #formBuilder = inject(FormBuilder);
  readonly #brandsService = inject(BrandsService);
  protected readonly brands = signal<string[]>([]);
  protected readonly models = signal<string[]>([]);

  protected readonly carForm = this.#formBuilder.group({
    optionSelect: [''],
  });

  ngOnInit() {
    this.#brandsService.getBrands().subscribe({
      next: (response) => {
        this.brands.set(response);
        console.log(this.brands);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getModels() {
    console.log('entra');
    const BRAND = this.carForm.controls['optionSelect'].value!;
    this.#brandsService.getModelByBrand(BRAND).subscribe({
      next: (response) => {
        this.models.set(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
