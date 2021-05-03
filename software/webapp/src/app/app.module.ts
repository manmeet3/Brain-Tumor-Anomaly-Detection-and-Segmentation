import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardRadiologistComponent } from './board-radiologist/board-radiologist.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { FormsModule } from '@angular/forms';
import { authInterceptorProviders } from './generic/auth.interceptor';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    BoardAdminComponent,
    BoardRadiologistComponent,
    BoardUserComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule, 
    AppRoutingModule, 
    FormsModule,
    HttpClientModule,
    IonicModule.forRoot(), 
    CommonModule, 
    BrowserAnimationsModule,
    MaterialModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, authInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
