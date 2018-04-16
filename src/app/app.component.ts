import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth-service.service';
import { Location } from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private router: Router,
    private location: Location,
    private spinnerService: Ng4LoadingSpinnerService
  ) {}

  ngOnInit() {
    this.spinnerService.show();
    /* if url is home, only then */
    this.authService.user.subscribe((userData) => {

      if (!!userData && (this.location.path() === '')) {
        this.router.navigate(['new-gratitudes']);
        this.spinnerService.hide();
      } else {
        this.spinnerService.hide();
      }
    });
  }
}
