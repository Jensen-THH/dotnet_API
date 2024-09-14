import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasDigit = /\d/.test(value);
    const hasSpecialChar = /[\W_]/.test(value); // Non-alphanumeric characters

    const valid = hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;

    return !valid ? { passwordStrength: true } : null;
  };
}
