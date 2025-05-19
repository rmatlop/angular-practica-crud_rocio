import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const registrationDateValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const registrationDate = control.get('registrationDate')?.value;
  const manufactureYear = control.get('manufactureYear')?.value;

  if (registrationDate && manufactureYear) {
    const registrationDateArray = registrationDate.split('/');
    const registrationYear = parseInt(registrationDateArray[0]);

    return registrationYear &&
      manufactureYear &&
      registrationYear < manufactureYear
      ? { registrationDateIncorrect: true }
      : null;
  } else {
    return null;
  }
};
