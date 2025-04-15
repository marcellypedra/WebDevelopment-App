import { Component, OnInit } from '@angular/core';
import { DateTime, Info, Interval } from 'luxon';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { ShiftsResponse } from '../../types/response.type';

import { AuthService } from '../../services/auth-service.service';
import { RosterService } from '../../services/roster.service';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.css']
})
export class RosterComponent implements OnInit {
  shifts: ShiftsResponse | null = null;

  today: DateTime = DateTime.local();
  firstDayOfActiveMonth: DateTime = this.today.startOf('month');
  activeDay: DateTime | null = null;
  weekDays: string[] = Info.weekdays('short');
  isLoading = false;
  errorMessage: string | null = null;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    events: [],
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.handleDateClick.bind(this),
    eventClassNames: (arg) => {
      return 'shift-event'; // Add a custom class to each event
    },
  };

  selectedShift: any | null = null;
  userId: string = '';

  constructor(
    private authService: AuthService,
    private rosterService: RosterService
  ) { }

  ngOnInit(): void {
    this.fetchShiftsForUser();
  }

  fetchShiftsForUser(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      console.error("User ID not found");
      this.errorMessage = "User ID not found. Please log in again.";
      this.isLoading = false;
      return;
    }
    console.log("userID from token: ", userId);
    this.rosterService.getShiftForUser(userId).subscribe({
      next: (data) => {
        this.shifts = data;
        this.isLoading = false;
        this.updateCalendarEvents();
      },
      error: (err) => {
        console.error('Failed to load shifts:', err);
        this.errorMessage = 'Failed to load shifts. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  handleEventClick(arg: any): void {
    this.selectedShift = arg.event.extendedProps.raw; // Store the clicked shift data
  }

  handleDateClick(arg: any): void {
    const clickedDate = DateTime.fromJSDate(arg.date).toISODate();

    // Filter shifts for the selected date
    const shiftsForDay = this.shifts?.shiftsForUser.filter(shift =>
      DateTime.fromISO(shift.shiftDate).toISODate() === clickedDate
    );

    if (shiftsForDay && shiftsForDay.length > 0) {
      this.selectedShift = shiftsForDay[0]; // Display the first shift for now
    } else {
      this.selectedShift = null; // No shift for this day
    }
  }
  getTotalHours(startTime: string, endTime: string): number {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
  
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
  
    let diffMinutes = endTotalMinutes - startTotalMinutes;
  
    // Handle overnight shifts (if endTime is past midnight)
    if (diffMinutes < 0) {
      diffMinutes += 24 * 60;
    }
  
    const diffHours = diffMinutes / 60;
    return diffHours;
  }
  
  updateCalendarEvents(): void {
    if (this.shifts && this.shifts.shiftsForUser) {
      this.calendarOptions.events = this.shifts.shiftsForUser.map(shift => ({
        title: `${shift.startTime} - ${shift.endTime}`,
        start: shift.shiftDate, // Ensure this is in ISO format
        end: shift.shiftDate,   // For all-day events, start and end can be the same
        allDay: true,
        extendedProps: { raw: shift } // Store shift data for click handling
      }));
    } else {
      this.calendarOptions.events = [];
    }
  }

  get daysOfMonth(): DateTime[] {
    return Interval.fromDateTimes(
      this.firstDayOfActiveMonth.startOf('week'),
      this.firstDayOfActiveMonth.endOf('month').endOf('week')
    )
      .splitBy({ day: 1 })
      .map((d) => d.start!);
  }

  get activeDayShift(): any[] {
    if (!this.activeDay) return [];
    const activeDayISO = this.activeDay.toISODate();

    return activeDayISO
      ? this.shifts!.shiftsForUser.filter(shift =>
        DateTime.fromISO(shift.shiftDate).toISODate() === activeDayISO
      ) : [];
  }

  goToPreviousMonth(): void {
    this.firstDayOfActiveMonth = this.firstDayOfActiveMonth.minus({ month: 1 });
    this.loadShiftsForMonth();
  }

  goToNextMonth(): void {
    this.firstDayOfActiveMonth = this.firstDayOfActiveMonth.plus({ month: 1 });
    this.loadShiftsForMonth();
  }

  goToToday(): void {
    this.firstDayOfActiveMonth = this.today.startOf('month');
    this.loadShiftsForMonth();
  }

  private loadShiftsForMonth(): void {
    this.fetchShiftsForUser();
  }
}