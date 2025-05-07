import { CarDetailsDto } from './car-details-dto.interface';

export interface Car {
  brand: string;
  model: string;
  carDetails: CarDetailsDto[];
  id: string;
  total: number;
}
