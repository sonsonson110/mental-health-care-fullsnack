import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordRequirementsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;

    if (!password) {
      return null;
    }

    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const valid = hasMinLength && hasUpperCase && hasNumber && hasSymbol;

    return valid ? null : { passwordRequirements: true };
  };
}
