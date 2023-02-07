import { Category } from "./category";
import { Profile } from "./profile";

export interface Article {
  id: number;
  title?: string;
  body?: string;
  isApproved: boolean;
  image: string;
  author: Profile;
  likes: Profile[];
  category: Category;
  createdAt: string;
}

export interface ArticleFormValues {
  title: string;
  body: string;
  categoryId: number;
}
