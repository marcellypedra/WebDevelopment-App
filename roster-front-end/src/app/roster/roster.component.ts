import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

import { RosterService } from '../services/roster.service';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.css'],
})
export class RosterComponent implements OnInit {
  userLoggedIn = '';
  selectedDate = '';
  shiftsForSelectedDate: any[] = [];

  configurationOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    events: [],
    // events: [
    //   { title: 'Shift1', start: '2025-02-26' },
    //   { title: 'Shift2', start: '2025-02-28' },
    // ],
  };

  // ngOnInit(): void {}

  constructor(private rosterService: RosterService) {}

  ngOnInit() {
    this.userLoggedIn = localStorage.getItem('userId') || '';
    if (this.userLoggedIn) {
      this.loadUserShifts();
    }
  }

  loadUserShifts() {
    this.rosterService
      .getShiftsForUser(this.userLoggedIn)
      .subscribe((userShifts) => {
        this.configurationOptions = {
          ...this.configurationOptions,
          events: userShifts.map((shift) => ({
            title: 'Your Shift', // Generic shift title
            start: shift.shiftDate,
            color: '#007bff',
          })),
        };
      });
  } //loadShifts ends here

  onDateClick(information: any) {
    this.selectedDate = information.dateStr;
    this.rosterService
      .getShiftsByDate(this.selectedDate)
      .subscribe((shifts) => {
        this.shiftsForSelectedDate = shifts;
      });
  } //ondateClick ends here
}
