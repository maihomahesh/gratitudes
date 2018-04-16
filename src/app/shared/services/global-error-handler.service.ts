import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { PopupService } from './popup.service';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {

    errorMessages = {
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/user-not-found': 'User does not exist. Sign up first.',
        'auth/wrong-password': 'The password is invalid or the user does not have a password.',
        'auth/network-request-failed': 'A network error occurred. Please try again.'
    };

    constructor(private injector: Injector) {}

    handleError (error: any) {
        const popupService = this.injector.get(PopupService);

        popupService.openSnackBar(this.getErrorMessage(error));
    }

    getErrorMessage(error) {
        // if (error.code in this.errorMessages) {
        //     return this.errorMessages[error.code];
        // } else {
        //     return 'Some error occurred. Please try again.';
        // }

        return error.message;
    }
}
