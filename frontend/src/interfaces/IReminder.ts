import { IUser } from "./IUser";

interface IDayOfWeek {
  number: number;
  weekday: string;
}

interface ITask {
  id: number;
  name: string;
  task: string;
  enabled: boolean;
  crontab: number;
}

export interface IReminder {
  id?: number;
  medicine_name: string;
  dosage: string;
  instructions: string;
  reminder_time: string;
  reminder_type: "daily" | "weekly" | "interval" | string;
  interval_value?: string;
  interval_type?: "minutes" | "hours" | "days" | "weeks";
  day_of_week?: IDayOfWeek[] | string;
  start_date: string | Date;
  end_date?: string | Date | null;
  is_active: boolean;
  next_reminder?: Date;
  image?: string;
  user?: IUser;
  task?: ITask;
}
