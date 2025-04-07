import { User } from "db/users";
import { Shift } from "db/shifts";

export interface ShiftsResponse {
  user: User;
  shiftsForUser: Shift[];
}
