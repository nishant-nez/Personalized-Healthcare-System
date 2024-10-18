import { IReminder } from "./IReminder";

export interface IReminderHistory {
  id: number;
  reminder: IReminder;
  is_taken: boolean;
  timestamp: Date;
  notes: string | null;
}
