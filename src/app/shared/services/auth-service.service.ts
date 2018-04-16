import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/observable/throw';
import 'rxjs/add/operator/catch';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

import { User } from '../models/user';

@Injectable()
export class AuthService {

  // user: Observable<firebase.User>;
  user: Observable<User>;
  // isEmailLogin = true;
  userId = '';
  photoURL = '';

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
    // this.user = afAuth.authState;
    this.user = this.afAuth.authState.switchMap(user => {
      if (user) {
        this.userId = user.uid;
        this.photoURL = user.photoURL;
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        return Observable.of(null);
      }
    });
  }

  emailSignUp(credential: EmailPasswordCredentials) {
    return this.afAuth.auth.createUserWithEmailAndPassword(credential.email, credential.password)
      .then((userData) => {
        this.updateUserData(userData);
      });
  }

  emailLogin(credential: EmailPasswordCredentials) {
    return this.afAuth.auth.signInWithEmailAndPassword(credential.email, credential.password)
      .then((userData) => {
        this.updateUserData(userData);
      });
  }

  resetPassword(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email)
      .then(() => console.log('email sent'));
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then(credential => {
        this.updateUserData(credential.user);
      });
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };

    this.router.navigate(['new-gratitudes']);

    // save the data
    return userRef.set(data);
  }

  signOut() {
    this.afAuth.auth.signOut()
      .then(() => {
        this.router.navigate(['/']);
      });
  }

} // ends AuthService

export class EmailPasswordCredentials {
  email: string;
  password: string;
}
