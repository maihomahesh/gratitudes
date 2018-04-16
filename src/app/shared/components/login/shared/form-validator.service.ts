import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Injectable()
export class FormValidatorService {

  controlName = '';

  constructor() { }

  private validationMessages() {
    const messages = {
      required: 'This field is required.',
      email: 'This email is invalid.',
      minlength: this.getCamelCase(this.controlName) + ' must be at least 6 characters long',
      maxlength: this.getCamelCase(this.controlName) + ' cannot be more than 40 characters long.',
      mismatchedPasswords: 'Passwords do not match.'
    };

    return messages;
  }

  validateForm(formToValidate: FormGroup, formErrors: any, checkDirty?: boolean) {
    const form = formToValidate;

    for (const field of Object.keys(formErrors)) {
      if (field) {
        this.controlName = field;
        formErrors[field] = '';
        const control = form.get(field);

        const messages = this.validationMessages();
        if (control && !control.valid) {
          if (!checkDirty || (control.dirty || control.touched)) {
            // console.log(control.errors);
            for (const key of Object.keys(control.errors)) {
              if (key && key !== 'invalid_characters') {
                formErrors[field] = formErrors[field] || messages[key];
              } else {
                formErrors[field] = formErrors[field] || messages[key](control.errors[key]);
              }
            }
          } else {
          }
        }
      }
    }

    return formErrors;
  } // validateForm

  getCamelCase(str: string) {
    return str[0].toUpperCase() + str.substr(1).toLowerCase();
  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl): boolean {
    // return true;
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
