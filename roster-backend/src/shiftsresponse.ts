import { Users } from "./users";
import { Shifts } from "./shifts";

export interface ShiftsResponse {
  user: Users;
  shiftsForUser: Shifts[];
}
