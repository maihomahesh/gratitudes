import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { GratitudeService } from '../gratitude.service';
import { AuthService } from '../../../shared/services/auth-service.service';
import { Gratitude } from '../gratitude';
// import 'rxjs/add/observable/empty';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css'],
})
export class ArchiveComponent implements OnInit {

  userId = '';
  isShowBest = false;
  isAscending = false;
  order = 'formattedDate'; // for ngx-order-pipe
  reverse = !this.isAscending;  // not reversing the order at first

  gratitudes: Observable<Gratitude[]>;


  constructor(
    private titleService: Title,
    public gratitudeService: GratitudeService,
    private authService: AuthService
  ) {
    this.userId = this.authService.userId;
  }

  ngOnInit() {
    this.titleService.setTitle('Gratitudes - Archive');

    if (this.isShowBest) {
      this.gratitudes = this.gratitudeService.getAllBestGratitudesForThisUser(this.userId);
    } else {
      this.gratitudes = this.gratitudeService.getAllGratitudesForThisUser(this.userId);
    }
  }

  onShowBestChange() {
    if (this.isShowBest) {
      this.gratitudes = this.gratitudeService.getAllBestGratitudesForThisUser(this.userId);
    } else {
      // this.gratitudes = Observable.empty<Gratitude[]>();
      this.gratitudes = this.gratitudeService.getAllGratitudesForThisUser(this.userId);
    }
  }

  toggleDateOrder() {
    this.isAscending = !this.isAscending;
    this.reverse = !this.reverse;
  }

  test() {
    console.log('test...');
  }

}
