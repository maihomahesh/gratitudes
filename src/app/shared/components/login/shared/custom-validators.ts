import { FormGroup, FormControl } from '@angular/forms';

export function emailValidator(control: FormControl): { [key: string]: any } {
    const emailRegexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (control.value && !emailRegexp.test(control.value)) {
        return { email: true };
    }
}

export function matchPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup) => {
        const password = group.controls[passwordKey];
        const confirmPassword = group.controls[confirmPasswordKey];
        if (password.value !== confirmPassword.value) {
            // return {
            //     mismatchedPasswords: true
            // };
            return confirmPassword.setErrors({ mismatchedPasswords: true });
        } else {
            /** update correctly when a change to 'password' input makes the data valid. */
            return confirmPassword.setErrors(confirmPassword.validator(confirmPassword));
        }
    };
}
