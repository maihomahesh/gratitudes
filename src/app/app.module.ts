import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';

import { environment } from '../environments/environment';
import { AuthService } from './shared/services/auth-service.service';
import { GlobalErrorHandlerService } from './shared/services/global-error-handler.service';
import { PopupService } from './shared/services/popup.service';
import { OrderModule } from 'ngx-order-pipe';
import { PipesModule } from './shared/modules/pipes.module';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './shared/modules/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { GratitudeModule } from './modules/gratitude/gratitude.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './shared/components/login/login.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    OrderModule,
    PipesModule,
    BrowserAnimationsModule,
    Angular2FontawesomeModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    GratitudeModule,
    AppRoutingModule,  // should be imported at last, otherwise page-not-found will interfere
    Ng4LoadingSpinnerModule.forRoot()
  ],
  providers: [
    Title,
    AuthService,
    PopupService,
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
