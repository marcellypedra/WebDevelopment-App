export interface ShiftsResponseForDate {
  shifts: {
    _id?: string;
    shiftDate: Date;
    startTime: string;
    endTime: string;
    user: {
      _id?: string;
      name: string;
      roleType: string;
    } | null;
  }[];
}
