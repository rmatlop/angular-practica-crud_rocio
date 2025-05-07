import { CarDetailsDto } from './car-details-dto.interface';

export interface CreateCarDto {
  brand: string;
  model: string;
  carDetails: CarDetailsDto[];
}
