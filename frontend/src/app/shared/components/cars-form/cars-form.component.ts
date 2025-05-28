import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { CarButtonDirective } from '../../directives/car-button.directive';
import { Currency } from '../../enums/currency.enum';
import { CarDetailsDto } from '../../interfaces/car-details-dto.interface';
import { CreateCarDto } from '../../interfaces/create-car-dto.interface';
import { BrandsService } from '../../services/brands.service';
import { CarsService } from '../../services/cars.service';
import { CarDetailsForm } from './interfaces/car-details.form.interface';
import { registrationDateValidator } from './validators/registration-date.validator';

@Component({
  selector: 'app-cars-form',
  imports: [ReactiveFormsModule, CarButtonDirective],
  templateUrl: './cars-form.component.html',
  styleUrl: './cars-form.component.css',
})
export class CarsFormComponent implements OnInit {
  readonly #formBuilder = inject(FormBuilder);
  readonly #brandsService = inject(BrandsService);
  readonly #carsService = inject(CarsService);
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #date = new Date();
  protected readonly brands = signal<string[]>([]);
  protected readonly models = signal<string[]>([]);
  protected readonly currencies = Object.values(Currency);
  protected id = '';
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
    this.id = this.#route.snapshot.paramMap.get('id')!;

    if (this.id === null) {
      this.#brandsService.getBrands().subscribe({
        next: (response) => {
          this.brands.set(response);
        },
        error: (error) => {
          console.log(error);
        },
      });

      const brandControl = this.carForm.controls.brand;

      brandControl.valueChanges
        .pipe(
          switchMap((brand) => {
            if (brand === '') {
              return of([]);
            } else {
              return this.#brandsService.getModelByBrand(brand!);
            }
          }),
        )
        .subscribe({
          next: (response) => {
            this.models.set(response);
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else {
      this.#carsService
        .getCarById(this.id)
        .pipe(
          map((response) => ({
            ...response,
            carDetails: response.carDetails.map((detail) => ({
              ...detail,
              registrationDate: this.formatStringToDate(
                detail.registrationDate,
              ),
            })),
          })),
        )
        .subscribe({
          next: (response) => {
            const carFormValues = {
              brand: response.brand,
              model: response.model,
              carDetails: response.carDetails,
            };

            //For every detail we create a new formArray in carForm
            response.carDetails.forEach((detail, index) => {
              if (index < response.total - 1) {
                this.addDetails();
              }
            });
            console.log('respuesta', response);
            this.carForm.setValue(carFormValues);
          },
          error: (error) => {
            console.log(error);
          },
        });
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
        currency: [Currency.EUR, [Validators.required]],
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
            Currency[detail.currency as keyof typeof Currency] ?? Currency.EUR,
          price: detail.price ?? 0,
          manufactureYear: detail.manufactureYear ?? 0,
          availability: detail.availability ?? true,
          licensePlate: this.formatLicensePlate(detail.licensePlate ?? ''),
        };
        return copyDetail;
      }),
    };

    return copyCarForm;
  }

  addDetails() {
    this.carDetails.push(this.getDetailsGroup());
  }

  removeDetails(index: number) {
    this.carDetails.removeAt(index);
  }

  formatStringToDate(dateToFormat: string) {
    const newDate = new Date(dateToFormat);

    const year = newDate.getFullYear();
    const month = ('0' + (newDate.getMonth() + 1)).slice(-2);
    const day = ('0' + newDate.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  formatLicensePlate(licensePlate: string) {
    if (licensePlate !== '') {
      const chars = Array.from(licensePlate);

      if (!chars.includes(' ')) {
        const indexFirstStringChar = chars.findIndex((char) =>
          isNaN(Number(char)),
        );

        const numberPart = chars.slice(0, indexFirstStringChar).join('');
        const stringPart = chars
          .slice(indexFirstStringChar)
          .join('')
          .toLocaleUpperCase();

        return numberPart + ' ' + stringPart;
      } else {
        return licensePlate.toLocaleUpperCase();
      }
    } else {
      return licensePlate;
    }
  }

  onSubmit() {
    if (this.carForm.valid) {
      const copyCarForm = this.getCreateCarData();

      if (this.id === null) {
        this.#carsService.createCar(copyCarForm).subscribe({
          next: (response) => {
            console.log(response);
          },
          error: (error) => {
            console.log(error);
          },
        });
      } else {
        this.#carsService.updateCar(copyCarForm, this.id).subscribe({
          next: (response) => {
            console.log(response);
          },
          error: (error) => {
            console.log(error);
          },
        });
      }

      this.resetForm();

      this.#router.navigate(['']);
    } else {
      /* When you submit the form without touching any fields, 
         mark them all as touched so that error messages appear */
      this.carForm.markAllAsTouched();
    }
  }

  resetForm() {
    this.carForm.reset();
  }
}
