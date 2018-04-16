import { Component, OnInit, ViewChild, Inject, ElementRef, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';

import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { GratitudeService } from '../gratitude.service';
import { AuthService } from '../../../shared/services/auth-service.service';
import { Gratitude } from '../gratitude';

@Component({
  selector: 'app-new-gratitudes',
  templateUrl: './new-gratitudes.component.html',
  styleUrls: ['./new-gratitudes.component.css']
})
export class NewGratitudesComponent implements OnInit {

  @ViewChild(FormGroupDirective) fgd: FormGroupDirective; // for resetting the form validation states
  // for removing the button focus after mat dialog closed
  @ViewChildren('deleteButtonRef', {read: ElementRef}) private deleteButtonRefs: any;
  deleteGratitudeDialogRef: MatDialogRef<DeleteGratitudeDialogComponent>;

  activeId: number;

  isEdit = false;
  isDateToday = true;
  userId = '';
  tempDate = '';
  currentGratitudeId = '';
  gratitudeDate = new Date();  // initially it will be today's date

  gratitudeForm: FormGroup;
  dateControl: FormControl;
  gratitudeControl: FormControl;
  isTheBestControl: FormControl;

  gratitudes: Observable<Gratitude[]>;
  totalGratitudes = 0;

  constructor(
    private titleService: Title,
    private fb: FormBuilder,
    private gratitudeService: GratitudeService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private spinnerService: Ng4LoadingSpinnerService) {
    this.userId = authService.userId;
  }

  ngOnInit() {
    this.titleService.setTitle('Gratitudes - Add New Gratitudes');
    this.createAddGratitudeFormControls();
    this.createAddGratitudeform();

    this.gratitudes = this.gratitudeService.getGratitudesForThisDate(this.userId, this.gratitudeService.getDateString(this.gratitudeDate));
    this.gratitudes.subscribe((data) => {
      this.totalGratitudes = data.length;
    });
  }

  // buildForm() {
  //   return this.gratitudeForm = this.fb.group({
  //     date: [{value: new Date(), disabled: this.isEdit}],
  //     gratitude: [''],
  //     isTheBest: false
  //   });
  // }

  createAddGratitudeFormControls() {
    this.dateControl = new FormControl(this.gratitudeDate);
    this.gratitudeControl = new FormControl('', [Validators.required]);
    this.isTheBestControl = new FormControl(false);
  }

  createAddGratitudeform() {
    this.gratitudeForm = new FormGroup({
      date: this.dateControl,
      gratitude: this.gratitudeControl,
      isTheBest: this.isTheBestControl
    });
  }

  addOrUpdateGratitude() {
    this.spinnerService.show();
    if (this.isEdit) {
      this.gratitudeService.updateGratitude(this.userId, this.currentGratitudeId, this.gratitudeForm.value)
      .then(() => {
        this.isEdit = false;
        this.fgd.resetForm();
        this.gratitudeForm.patchValue({
          date: this.gratitudeDate
        });
        this.isDateToday = (this.gratitudeService.checkIfToday(this.gratitudeForm.value.date)) ? true : false;
        this.gratitudes.subscribe((data) => {
          this.totalGratitudes = data.length;
        });
        this.spinnerService.hide();
      });
    } else {
      this.gratitudeService.addGratitude(this.userId, this.gratitudeForm.value)
      .then(() => {
        this.fgd.resetForm();
        this.gratitudeForm.patchValue({
          date: this.gratitudeDate
        });
        this.spinnerService.hide();
      });
    }
  }

  onChangeDateValue() {
    this.isDateToday = (this.gratitudeService.checkIfToday(this.gratitudeForm.value.date)) ? true : false;
    if (!this.isEdit) {
      this.gratitudeDate = this.gratitudeForm.value.date;
      this.gratitudes = this.gratitudeService.getGratitudesForThisDate(this.userId,
        this.gratitudeService.getDateString(this.gratitudeDate));
      this.gratitudes.subscribe((data) => {
        this.totalGratitudes = data.length;
      });
    }
  }

  cancelEdit() {
    this.fgd.resetForm(); // to clear validation state
    this.gratitudeForm.patchValue({
      date: this.gratitudeDate
    });
    this.isEdit = false;
    this.isDateToday = (this.gratitudeService.checkIfToday(this.gratitudeForm.value.date)) ? true : false;
  }

  resetForm() {
    this.fgd.resetForm();
    this.gratitudeForm.patchValue({
      date: this.gratitudeDate
    });
  }

  editGratitude(gratitude, targetElement) {
    this.isEdit = true;
    this.tempDate = this.gratitudeForm.value.date;
    this.currentGratitudeId = gratitude.id;
    this.gratitudeForm.setValue({
      date: new Date(gratitude.date),
      gratitude: gratitude.gratitude,
      isTheBest: gratitude.isTheBest
    });

    /* scroll to top */
    // window.scroll(0, 0);
    // targetElement.scrollIntoView({behavior: 'smooth'});
    targetElement.scrollIntoView();
  }

  deleteGratitude(id) {
    this.gratitudeService.deleteGratitude(id).then(() => {
      this.resetForm();
    });
  }

  isBeingEdited(divGratitudeId) {
    if (this.isEdit && (divGratitudeId === this.currentGratitudeId)) {
      return true;
    } else {
      return false;
    }
  }

  /* Dialog actions */
  openDeleteGratitudeDialog(id, index) {

    this.deleteGratitudeDialogRef = this.dialog.open(DeleteGratitudeDialogComponent, {
      hasBackdrop: true
    });


    this.deleteGratitudeDialogRef.afterClosed().subscribe((result) => {
      /* remove the button ripple effect */
      this.deleteButtonRefs._results[index].nativeElement.classList.remove('cdk-program-focused');
      this.deleteButtonRefs._results[index].nativeElement.classList.add('cdk-mouse-focused');

      if (result) { /* gratitude deleted */
        /* show deleted snack bar, then reset the form */
        this.deleteGratitude(id);
        this.snackBar.open('Deleted!', '', {
          duration: 1500,
          horizontalPosition: 'end',
          verticalPosition: 'top'});
      }
    });
  }

} // end NewGratitudesComponent

/* Delete Gratitude Dialog Component */
@Component({
  template: `
  <h1 mat-dialog-title style="text-align:center">Delete Gratitude</h1>
  <mat-dialog-content>
    Are you sure you want to delete this gratitude?
  </mat-dialog-content>
  <mat-dialog-actions style="display:block;text-align:center">
    <button mat-button mat-dialog-close>Cancel</button>
    <button mat-button (click)="delete()">Delete</button>
  </mat-dialog-actions>
  `
})
export class DeleteGratitudeDialogComponent {

  constructor(private dialogRef: MatDialogRef<DeleteGratitudeDialogComponent>,
    private gratitudeService: GratitudeService) {}

  delete() {
    this.dialogRef.close(true);
  }
}
