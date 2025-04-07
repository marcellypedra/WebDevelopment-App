import { Shifts } from './shifts.model';
import { Users } from './users.model';

export interface ShiftsResponse {
  user: Users;
  shiftsForUser: Shifts[];
}
