import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';
import { InputComponent } from './components/input/input.component';
import { PasswordComponent } from './components/password/password.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { RosterComponent } from './roster/roster.component';
import { FooterComponent } from './footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './services/auth-service.service';
import { ProfileComponent } from './pages/profile/profile.component';
import { UsersComponent } from './pages/users/users.component';
@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    InputComponent,
    PasswordComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    HeaderComponent,
    RosterComponent,
    FooterComponent,
    ProfileComponent,
    UsersComponent,
    PasswordComponent,
    UsersComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    HttpClientModule,
    FullCalendarModule,
    BrowserAnimationsModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
