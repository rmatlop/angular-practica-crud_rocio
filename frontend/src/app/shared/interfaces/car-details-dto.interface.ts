import { Currency } from '../enums/currency.enum';

export interface CarDetailsDto {
  registrationDate: string;
  mileage: number;
  currency: Currency;
  price: number;
  manufactureYear: number;
  availability: boolean;
  licensePlate: string;
}
