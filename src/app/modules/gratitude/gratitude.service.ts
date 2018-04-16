import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

import { Gratitude } from './gratitude';


@Injectable()
export class GratitudeService {

  firestoreGratitudeCollectionName = 'gratitudes';
  gratitudesCol: AngularFirestoreCollection<Gratitude>;
  gratitudes: Observable<Gratitude[]>;
  dateFormat = 'MM/dd/yyyy';  // so it will be useful while sorting

  constructor(private afs: AngularFirestore) { }

  getCurrentDate(): string {
    const pipe = new DatePipe('en-US');
    const now = Date.now();
    return pipe.transform(now, this.dateFormat);
  } // getCurrentDate

  getDateString(dateValue) {
    const pipe = new DatePipe('en-US');
    return pipe.transform(dateValue, this.dateFormat);
  }

  getIdFromDate(dateValue): string {
    const pipe = new DatePipe('en-US');
    const dateString = pipe.transform(dateValue, 'yyyyMMdd');
    const id = this.afs.createId();
    return dateString + id;
  }

  getFormattedDate(dateValue): string {
    const pipe = new DatePipe('en-US');
    return pipe.transform(dateValue, 'yyyyMMdd');
  }

  checkIfToday(dateValue) {
    const pipe = new DatePipe('en-US');
    const dateValueString = pipe.transform(dateValue, this.dateFormat);
    const nowString = pipe.transform(Date.now(), this.dateFormat);
     return (dateValueString === nowString) ? true : false;
  }

  deleteGratitude(gratitudeId) {
    return this.afs.doc(this.firestoreGratitudeCollectionName + '/' + gratitudeId).delete();
  } // deleteGratitude

  addGratitude(userId, formData) {
    if (formData.isTheBest) {
      return this.getBestGratitudesForThisDate(userId, this.getDateString(formData.date))
        .map((res) => {
          if (res.length > 0) {
            res.forEach((gratitudeDoc: Gratitude) => {
              this.updateIsTheBestFieldValue(gratitudeDoc.id, false);
            });
          }
        }).toPromise().then(() => {
          return this.addGratitudeWithFormData(userId, formData);
        });
    } else {
      return this.addGratitudeWithFormData(userId, formData);
    }
  } // end addGratitude

  updateGratitude(userId, gratitudeId, formData) {
    // if the gratitude is the best, then get gratitude(s) for this day with
    // isTheBest: true, update it to false, then update gratitude

    if (formData.isTheBest) {
      return this.getBestGratitudesForThisDate(userId, this.getDateString(formData.date))
        .map((res) => {
          if (res.length > 0) {
            res.forEach((gratitudeDoc: Gratitude) => {
              this.updateIsTheBestFieldValue(gratitudeDoc.id, false);
            });
          }
        }).toPromise().then(() => {
          return this.updateGratitudeWithFormData(userId, gratitudeId, formData);
        });
    } else {
      return this.updateGratitudeWithFormData(userId, gratitudeId, formData);
    } // end if
  } // updateGratitude

  updateIsTheBestFieldValue(docId: string, fieldValue: boolean) {
    this.afs.doc(this.firestoreGratitudeCollectionName + '/' + docId).update({ 'isTheBest': fieldValue });
  }

  addGratitudeWithFormData(userId, formData) {
    // const id = this.getIdFromDate(formData.date);
    const id = this.afs.createId();
    return this.afs.collection(this.firestoreGratitudeCollectionName).doc(id)
      .set({
        'id': id,
        'date': this.getDateString(formData.date),
        'gratitude': formData.gratitude,
        'userId': userId,
        'isTheBest': formData.isTheBest,
        'createdAt': firebase.firestore.FieldValue.serverTimestamp(),
        'formattedDate': this.getFormattedDate(formData.date)
      });
  }

  updateGratitudeWithFormData(userId, gratitudeId, formData) {
    return this.afs.doc(this.firestoreGratitudeCollectionName + '/' + gratitudeId)
      .update({
        'date': this.getDateString(formData.date),
        'gratitude': formData.gratitude,
        'userId': userId,
        'isTheBest': formData.isTheBest,
        'formattedDate': this.getFormattedDate(formData.date)
      });
  }

  getBestGratitudesForThisDate(userId, dateValue) {
    const gratitudesRef = this.afs.collection(this.firestoreGratitudeCollectionName,
      ref => ref.where('userId', '==', userId)
        .where('date', '==', dateValue)
        .where('isTheBest', '==', true));

    return gratitudesRef.valueChanges().pipe(take(1));
  }

  getAllBestGratitudesForThisUser(userId) {
    this.gratitudesCol = this.afs.collection(this.firestoreGratitudeCollectionName,
      ref => ref.where('userId', '==', userId)
        .where('isTheBest', '==', true));
    return this.gratitudesCol.valueChanges();
  }

  getAllGratitudesForThisUser(userId) {
    this.gratitudesCol = this.afs.collection(this.firestoreGratitudeCollectionName,
      ref => ref.where('userId', '==', userId));
        return this.gratitudesCol.valueChanges();
  }

  getGratitudesForThisDate(userId, dateValue) {
    this.gratitudesCol = this.afs.collection(this.firestoreGratitudeCollectionName,
      ref => ref.where('userId', '==', userId)
        .where('date', '==', dateValue)
        .orderBy('createdAt', 'desc'));
    return this.gratitudesCol.valueChanges();
  }

  markGratitudeAsBest(userId, gratitudeId, gratitudeDate) {
    this.getBestGratitudesForThisDate(userId, gratitudeDate)
      .map((res) => {
        if (res.length > 0) {
          res.forEach((gratitudeDoc: Gratitude) => {
            this.updateIsTheBestFieldValue(gratitudeDoc.id, false);
          });
        }
      }).toPromise().then(() => {
        this.updateIsTheBestFieldValue(gratitudeId, true);
      });
  } // markGratitudeAsBest
}
