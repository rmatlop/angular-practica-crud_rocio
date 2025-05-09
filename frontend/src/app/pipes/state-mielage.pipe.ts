import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stateMielage',
})
export class StateMielagePipe implements PipeTransform {
  transform(value: number): string {
    let message = '';

    if (value === 0) {
      message = 'Nuevo';
    } else if (value < 100) {
      message = 'Km 0';
    } else {
      message = 'Ocasión';
    }
    return message;
  }
}
