import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { BrandsService } from '../../services/brands.service';
import { CarsService } from '../../services/cars.service';
import { CarButtonDirective } from '../../shared/directives/car-button.directive';
import { Currency } from '../../shared/interfaces/car-details-dto.interface';
import { CreateCarDto } from '../../shared/interfaces/create-car-dto.interface';

const registrationDateValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const registrationDate = control.get('registrationDate')?.value;
  const manufactureYear = control.get('manufactureYear')?.value;

  if (registrationDate && manufactureYear) {
    const registrationDateArray = registrationDate.split('-');
    const registrationYear = parseInt(registrationDateArray[0]);

    return registrationYear < manufactureYear
      ? { registrationDateIncorrect: true }
      : null;
  } else {
    return null;
  }
};

@Component({
  selector: 'app-form-cars-create',
  imports: [ReactiveFormsModule, CarButtonDirective],
  templateUrl: './form-cars-create.component.html',
  styleUrl: './form-cars-create.component.css',
})
export class FormCarsCreateComponent implements OnInit {
  readonly #formBuilder = inject(FormBuilder);
  readonly #brandsService = inject(BrandsService);
  readonly #carsService = inject(CarsService);
  readonly #date = new Date();
  protected readonly brands = signal<string[]>([]);
  protected readonly models = signal<string[]>([]);
  protected readonly currencies = Object.values(Currency);

  protected readonly carForm: FormGroup = this.#formBuilder.group({
    brand: [''],
    model: [''],
    carDetails: this.#formBuilder.array([this.getDetailsGroup()]),
  });

  ngOnInit() {
    this.#brandsService.getBrands().subscribe({
      next: (response) => {
        this.brands.set(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getModels() {
    const brand = this.carForm.controls['brand'].value!;
    this.#brandsService.getModelByBrand(brand).subscribe({
      next: (response) => {
        this.models.set(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getDetailsGroup(): FormGroup {
    return this.#formBuilder.group(
      {
        registrationDate: ['', [Validators.required]],
        manufactureYear: [
          '',
          [
            Validators.required,
            Validators.min(1900),
            Validators.max(this.#date.getFullYear()),
            Validators.minLength(4),
            Validators.maxLength(4),
          ],
        ],
        currency: ['', [Validators.required]],
        price: ['', [Validators.required]],
        licensePlate: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^[0-9]{4}\s?[BCDFGHJKLMNPRSTVWXYZbcdfghjklmnprstvwxyz]{3}$/,
            ),
          ],
        ],
        mileage: ['', [Validators.required]],
        availability: ['', [Validators.required]],
      },
      { validators: registrationDateValidator },
    );
  }

  get carDetails() {
    return this.carForm.get('carDetails') as FormArray;
  }

  addDetails() {
    this.carDetails.push(this.getDetailsGroup());
  }

  onSubmit() {
    const copyCarForm: CreateCarDto = {
      ...this.carForm.value,
    };

    for (const detail of copyCarForm.carDetails) {
      const date = new Date(detail.registrationDate);
      if (!isNaN(date.getTime())) {
        detail.registrationDate = date.toISOString();
      }
    }

    this.#carsService.createCar(copyCarForm).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });

    this.resetForm();
  }

  resetForm() {
    this.carForm.reset();
  }
}
