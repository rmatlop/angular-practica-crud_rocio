import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BrandsService } from '../../services/brands.service';
import { CarsService } from '../../services/cars.service';
import { CarButtonDirective } from '../../shared/directives/car-button.directive';
import { Currency } from '../../shared/enums/currency.enum';
import { CarDetailsDto } from '../../shared/interfaces/car-details-dto.interface';
import { CreateCarDto } from '../../shared/interfaces/create-car-dto.interface';
import { CarDetailsForm } from './car-details.form';
import { registrationDateValidator } from './validators/registration-date.validator';

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
  readonly #PRICE_MIN = 1;
  readonly #DATE_MIN = 1900;

  protected readonly carForm = this.#formBuilder.group({
    brand: ['', [Validators.required]],
    model: ['', [Validators.required]],
    carDetails: this.#formBuilder.array<FormGroup<CarDetailsForm>>([
      this.getDetailsGroup(),
    ]),
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

  updateModels() {
    const brand = this.carForm.controls['brand'].value;
    if (brand) {
      this.#brandsService.getModelByBrand(brand).subscribe({
        next: (response) => {
          this.models.set(response);
        },
        error: (error) => {
          console.log(error);
        },
      });
    } else {
      this.models.set([]);
    }
  }

  getDetailsGroup(): FormGroup {
    return this.#formBuilder.group(
      {
        registrationDate: ['', [Validators.required]],
        manufactureYear: [
          '',
          [
            Validators.required,
            Validators.min(this.#DATE_MIN),
            Validators.max(this.#date.getFullYear()),
          ],
        ],
        currency: ['', [Validators.required]],
        price: ['', [Validators.required, Validators.min(this.#PRICE_MIN)]],
        licensePlate: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^\d{4}\s?[B-DF-HJ-NPR-TV-Zb-df-hj-npr-tv-z]{3}$/,
            ),
          ],
        ],
        mileage: ['', [Validators.required]],
        availability: [false],
      },
      { validators: registrationDateValidator },
    );
  }

  get carDetails() {
    return this.carForm.controls.carDetails;
  }

  getCreateCarData() {
    const copyCarForm: CreateCarDto = {
      brand: this.carForm.controls['brand'].value ?? '',
      model: this.carForm.controls['model'].value ?? '',
      carDetails: this.carForm.controls['carDetails'].value.map((detail) => {
        let copyRegistrationDate = '';

        if (detail.registrationDate) {
          copyRegistrationDate = new Date(
            detail.registrationDate,
          ).toISOString();
        }

        const copyDetail: CarDetailsDto = {
          registrationDate: copyRegistrationDate,
          mileage: detail.mileage ?? 0,
          currency:
            Currency[detail.currency as keyof typeof Currency] ?? Currency.Eur,
          price: detail.price ?? 0,
          manufactureYear: detail.manufactureYear ?? 1900,
          availability: detail.availability ?? true,
          licensePlate: detail.licensePlate?.toLocaleUpperCase() ?? '',
        };
        return copyDetail;
      }),
    };

    return copyCarForm;
  }

  addDetails() {
    this.carDetails.push(this.getDetailsGroup());
  }

  onSubmit() {
    if (this.carForm.valid) {
      const copyCarForm = this.getCreateCarData();
      this.#carsService.createCar(copyCarForm).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        },
      });

      this.resetForm();
    } else {
      this.carForm.markAllAsTouched();
    }
  }

  resetForm() {
    this.carForm.reset();
  }
}
