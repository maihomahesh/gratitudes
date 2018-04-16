import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth-service.service';
import { matchPasswords, emailValidator } from './shared/custom-validators';
import { FormValidatorService, MyErrorStateMatcher } from './shared/form-validator.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [FormValidatorService, MyErrorStateMatcher]
})

export class LoginComponent implements OnInit {

  static readonly LOGIN_TITLE = 'Gratitudes - Login';
  static readonly SIGNUP_TITLE = 'Gratitudes - Signup';
  isNewUser = false;  // to toggle between login and signup form
  isPasswordMismatch = false;

  userLoginForm: FormGroup;
  email: FormControl;
  password: FormControl;

  userSignUpForm: FormGroup;

  loginFormErrors = {
    'email': '',
    'password': ''
  };

  signUpFormErrors = {
    'email': '',
    'password': '',
    'confirmPassword': ''
  };

  constructor(public authService: AuthService,
    private formValidatorService: FormValidatorService,
    public matcher: MyErrorStateMatcher,
    private fb: FormBuilder,
    private router: Router,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle(LoginComponent.LOGIN_TITLE);
    this.createLoginFormControls();
    this.createLoginForm();
  }

  createLoginFormControls() {
    this.email = new FormControl('', Validators.compose([Validators.required, emailValidator]));
    this.password = new FormControl('', [Validators.required]);
  }

  createLoginForm() {
    this.userLoginForm = new FormGroup({
      email: this.email,
      password: this.password
    });

    // this.userLoginForm.valueChanges.subscribe((data) => this.onValueChanged(data)); // reset validation messages
    this.userLoginForm.valueChanges.subscribe((data) => {
      // validate form controls that are dirty (touched).
      this.loginFormErrors = this.formValidatorService.validateForm(this.userLoginForm, this.loginFormErrors, true);
    });
  }

  buildSignUpForm(): void {
    this.userSignUpForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, emailValidator])],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: matchPasswords('password', 'confirmPassword')
    });

    this.userSignUpForm.valueChanges.subscribe((data) => {
      // validate form controls that are dirty (touched).
      this.signUpFormErrors = this.formValidatorService.validateForm(this.userSignUpForm, this.signUpFormErrors, true);
    });
  }

  toggleForm(): void {
    this.isNewUser = !this.isNewUser;
    if (this.isNewUser) {
      this.titleService.setTitle(LoginComponent.SIGNUP_TITLE);
      this.userLoginForm.reset();
      this.buildSignUpForm();
    } else {
      this.titleService.setTitle(LoginComponent.LOGIN_TITLE);
      this.userSignUpForm.reset();
    }
  }

  signUp(): void {
    if (this.userSignUpForm.valid) {
      this.authService.emailSignUp(this.userSignUpForm.value);
    } else {
      this.signUpFormErrors = this.formValidatorService.validateForm(this.userSignUpForm, this.signUpFormErrors, false);
    }
  }

  login(): void {
    if (this.userLoginForm.valid) {
      this.authService.emailLogin(this.userLoginForm.value);
    } else {
      // check every form field independent of whether it's touched
      this.loginFormErrors = this.formValidatorService.validateForm(this.userLoginForm, this.loginFormErrors, true);
    }
  }

  resetPassword() {
    this.authService.resetPassword(this.userLoginForm.value['email']);
  }

} // LoginComponent
