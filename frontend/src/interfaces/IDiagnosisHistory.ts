import { IUser } from "./IUser";

export interface IDiagnosisHistory {
  id: number;
  name: string;
  symptoms: {
    string: number;
  };
  user: IUser;
  updated_at: Date;
  created_at: Date;
}
