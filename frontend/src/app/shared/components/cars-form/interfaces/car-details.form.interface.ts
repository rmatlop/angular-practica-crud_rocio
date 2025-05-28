import { FormControl } from '@angular/forms';

export interface CarDetailsForm {
  registrationDate: FormControl<string>;
  mileage: FormControl<number>;
  currency: FormControl<string>;
  price: FormControl<number>;
  manufactureYear: FormControl<number>;
  availability: FormControl<boolean>;
  licensePlate: FormControl<string>;
}
