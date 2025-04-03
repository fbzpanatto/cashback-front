import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function isNumber(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value

    return isNaN(value) ? { isNumber: true } : null
  };
}

export function decimalValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // Permite valores vazios (caso o campo seja opcional)
    if (!value) return null;

    // Expressão regular: 1 dígito antes do ponto, até 4 depois (ex: "0.1234", "1.0")
    const decimalRegex = /^(1(\.0{1,4})?|0(\.\d{1,4})?)$/;

    return decimalRegex.test(value) ? null : { decimalFormat: true };
  };
}

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value
    if(!value) { return null }

    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);
    const minMaxLength = value.length === 8;
    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && minMaxLength;
    return !passwordValid ? { passwordStrength: true } : null;
  }
}

export function confirmPassValidation(): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {

    const password:string = form.get("password")?.value;

    const confirmPassword:string = form.get("confirmPassword")?.value;

    return password === confirmPassword ? null : { confirmPassword: true }
  }
}
