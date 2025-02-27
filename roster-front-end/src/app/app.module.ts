import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FullCalendarModule } from '@fullcalendar/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RosterComponent } from './roster/roster.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    RosterComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FullCalendarModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
