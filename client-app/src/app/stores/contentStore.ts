import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Article } from "../models/article";
import { Category } from "../models/category";
import { Profile } from "../models/profile";

export default class ContentStore {
  categories: Category[] = [];
  articles: Article[] = [];
  profiles: Profile[] = [];
  savedArticles: Article[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  getCategories = async () => {
    const categories = await agent.requests.get<Category[]>(
      "/Categories?orderByArticleCount=true"
    );
    runInAction(() => (this.categories = categories));
  };

  getArticles = async (
    category = "",
    orderByDate = false,
    orderByLiked = false
  ) => {
    const articles = await agent.requests.get<Article[]>(
      `/Articles?category=${category}&orderByDate=${orderByDate}&orderByLikes=${orderByLiked}`
    );
    runInAction(() => (this.articles = articles));
  };

  getSavedArticles = async () => {
    const savedArticles = await agent.requests.get<Article[]>(
      `/Profiles/saved`
    );
    runInAction(() => (this.savedArticles = savedArticles));
  };

  queryArticles = async ({
    titleQuery,
    bodyQuery,
    authorQuery,
  }: {
    titleQuery: string;
    bodyQuery: string;
    authorQuery: string;
  }) => {
    const articles = await agent.requests.get<Article[]>(
      `/Articles/search?titleSubstring=${titleQuery}&bodySubstring=${bodyQuery}&authorNameSubstring=${authorQuery}`
    );
    console.log(`/Articles/search?titleSubstring=${titleQuery}&bodySubstring=${bodyQuery}&authorNameSubstring=${authorQuery}`);
    
    runInAction(() => (this.articles = articles));
  };

  getProfiles = async (orderByArticleLikes = true) => {
    const profiles = await agent.requests.get<Profile[]>(
      `/Profiles?orderByArticleLikes=${orderByArticleLikes}`
    );
    runInAction(() => (this.profiles = profiles));
  };

  likeArticle = async (id: string) => {
    await agent.requests.put(`/Articles/like`, { articleId: id });
    this.getArticles();
  };

  saveArticle = async (id: string) => {
    await agent.requests.put(`/Articles/save`, { articleId: id });
    this.getSavedArticles();
  };
}
