import { Component, OnInit } from '@angular/core';
import { DateTime, Info, Interval } from 'luxon';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { Shift, ShiftsResponse, TeamShiftsResponse } from '../../types/response.type';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.css']
})
export class RosterComponent implements OnInit {
  userShifts: ShiftsResponse | null = null;
  teamShifts: TeamShiftsResponse | null = null;

  today: DateTime = DateTime.local();
  firstDayOfActiveMonth: DateTime = this.today.startOf('month');
  activeDay: DateTime | null = null;
  weekDays: string[] = Info.weekdays('short');
  isLoading = false;
  errorMessage: string | null = null;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.handleDateClick.bind(this),
    eventClassNames: (arg) => {
      return ['shift-event', ...arg.event.classNames];
    }
  };

  selectedShift: any | null = null;
  userId: string = '';

  dailySummaries: { date: string, userShifts: number, teamShifts: number }[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.fetchShifts();
  }

  fetchShifts(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      this.errorMessage = "User ID not found. Please log in again.";
      this.isLoading = false;
      return;
    }

    let userLoaded = false;
    let teamLoaded = false;

    const checkAndUpdate = () => {
      if (userLoaded && teamLoaded) {
        this.updateCalendarEvents();
        this.updateDailySummaries();
        this.isLoading = false;
      }
    }

    // Fetch user shifts
    this.authService.getShiftForUser(userId).subscribe({
      next: (userData) => {
        console.log('Team shifts data:', userData);
        this.userShifts = userData;
        userLoaded = true;
        checkAndUpdate();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load user shifts.';
        this.isLoading = false;
      }
    });

    // Fetch team shifts
    this.authService.getTeamShifts().subscribe({
      next: (teamData: any) => {
        console.log('Team shifts raw:', teamData);
        this.teamShifts = {
          shiftsForTeam: teamData.shifts.map((shift: Shift) => ({
            ...shift,
            shiftDate: new Date(shift.shiftDate).toISOString().split('T')[0]
          }))
        };
        teamLoaded = true;
        checkAndUpdate();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load team shifts.';
        this.isLoading = false;
      }
    });
  }

  handleEventClick(arg: any): void {
    this.selectedShift = arg.event.extendedProps.raw;
  }

  handleDateClick(arg: any): void {
    const clickedDate = DateTime.fromJSDate(arg.date).toISODate();
    
    if (clickedDate) {
      this.activeDay = DateTime.fromISO(clickedDate);
      
      // Check both user and team shifts
      const allShifts = [
        ...(this.userShifts?.shiftsForUser || []),
        ...(this.teamShifts?.shiftsForTeam || [])
      ];
      
      this.selectedShift = allShifts.find(
        shift => shift.shiftDate === clickedDate
      ) || null;
    } else {
      this.activeDay = null;
      this.selectedShift = null;
    }
  }
  
  get selectedDaySummary() {
    if (!this.activeDay) return null;
  
    const dateISO = this.activeDay.toISODate();
  
    const userShifts = this.userShifts?.shiftsForUser?.filter(
      shift => shift.shiftDate === dateISO
    ).length || 0;
  
    const teamShifts = this.teamShifts?.shiftsForTeam?.filter(
      shift => shift.shiftDate === dateISO
    ).length || 0;
  
    return {
      date: dateISO,
      userShifts,
      teamShifts
    };
  }  
  getTotalHours(startTime: string, endTime: string): number {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    let diffMinutes = endTotalMinutes - startTotalMinutes;

    if (diffMinutes < 0) {
      diffMinutes += 24 * 60;
    }

    const diffHours = diffMinutes / 60;
    return diffHours;
  }

  updateCalendarEvents(): void {
    const userEvents = (this.userShifts?.shiftsForUser ?? []).map((shift: Shift) => ({
      title: `${shift.startTime} - ${shift.endTime} (You)`,
      start: shift.shiftDate,
      allDay: true,
      classNames: ['user-shift'],
      extendedProps: { raw: shift }
    }));

    const teamEvents = (this.teamShifts?.shiftsForTeam ?? []).map((shift: Shift) => ({
      title: `${shift.startTime} - ${shift.endTime} (Team)`,
      start: shift.shiftDate,
      allDay: true,
      classNames: ['team-shift'],
      extendedProps: { raw: shift }
    }));    

    this.calendarOptions = {
      ...this.calendarOptions,
      eventSources: [
        {
          events: userEvents,
          color: 'blue', // User events color
          textColor: 'white'
        },
        {
          events: teamEvents,
          color: 'green', // Team events color
          textColor: 'white'
        }
      ]
    };    
    setTimeout(() => window.dispatchEvent(new Event('resize')), 0);
    console.log('Calendar events:', [...userEvents, ...teamEvents]);
  }

  updateDailySummaries(): void {
    const daysInMonth = this.daysOfMonth;
    this.dailySummaries = daysInMonth.map(day => {
      const dateISO = day.toISODate();
      
      const userShifts = this.userShifts?.shiftsForUser?.filter(shift =>
        shift.shiftDate === dateISO
      ).length || 0;
  
      const teamShifts = this.teamShifts?.shiftsForTeam?.filter(shift =>
        shift.shiftDate === dateISO
      ).length || 0;
  
      return {
        date: dateISO!,
        userShifts,
        teamShifts
      };
    });
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
    if (!this.activeDay || !this.userShifts?.shiftsForUser) return [];

    return this.userShifts.shiftsForUser.filter(shift =>
      DateTime.fromISO(shift.shiftDate).toISODate() === this.activeDay!.toISODate()
    );
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
    this.fetchShifts();
  }
}
