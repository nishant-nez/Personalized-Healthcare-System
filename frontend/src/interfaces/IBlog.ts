import { ICategory } from "./ICategory";
import { IUser } from "./IUser";

export interface IBlog {
  id: number;
  title: string;
  content: string;
  author: IUser;
  image_url: string;
  updated_at: Date;
  created_at: Date;
  categories: ICategory[];
}
