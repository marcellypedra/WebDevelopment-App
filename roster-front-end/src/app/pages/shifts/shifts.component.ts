import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShiftService } from '../../services/shifts.service'; 


@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.css']
})
export class ShiftsComponent implements OnInit {

  shiftbegindate!: Date;
  shiftenddate!: Date;

  shiftDates: Date[] = [];
  users: { _id: string; name: string }[] = [];
  shifts: any[] = [];



  constructor(private router: Router, private shiftService: ShiftService) {}

  ngOnInit(): void {
    this.getAllUsers();}

    getAllUsers() {
      this.shiftService.getAllUsers().subscribe((response) => {
        this.users = response.users;
        // When employees are fetched, initialize shift table if dates already selected
        if (this.shiftbegindate && this.shiftenddate) {
          this.generateWeekDates();
        }
      });
    }



  generateWeekDates() {
    if (!this.shiftbegindate || !this.shiftenddate) return;

    const start = new Date(this.shiftbegindate);
    const end = new Date(this.shiftenddate);

    this.shiftDates = [];
    let current = new Date(start);

    while (current <= end) {
      this.shiftDates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    // Initialize empty shifts for each employee and each date
    this.shifts = this.users.map(() => {
      return this.shiftDates.map(date => ({
        date,
        start: '',
        end: '',
        dayOff: false
      }));
    });

    console.log("Users:", this.users);
    console.log("Type:", typeof this.users);
    console.log("Is array?", Array.isArray(this.users));
  }

  submit() {
    const payload = [];
    for (let i = 0; i < this.users.length; i++) {
      const user = this.users[i];

      for (let j = 0; j < this.shiftDates.length; j++) {
        const shiftData = this.shifts[i][j];
        if (!shiftData.dayOff && shiftData.start && shiftData.end) {

          payload.push({
            userId: user._id,
            shiftDate: shiftData.date,
            startTime: shiftData.start,
            endTime: shiftData.end
           });
        }   
      }
    }
    
    console.log('Submitting shifts:', payload);

    this.shiftService.saveShifts(payload).subscribe({
      next: () => alert('Shifts saved successfully'),
      error: (err) => console.error('Error saving shifts:', err)
    });
  }



  navigate() {
    this.router.navigate(['login']);
  }
}
  