export interface IHistoryStats {
  total_reminders: number;
  reminders_taken: number;
  reminders_missed: number;
  reminders_last_day: number;
  oldest: string;
  newest: string;
  by_month: [
    {
      month_year: string;
      total: number;
      taken: number;
      missed: number;
    }
  ];
}
