import { CancelToken } from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Article } from "../models/article";
import { Category } from "../models/category";
import { Profile, ProfileFormValues } from "../models/profile";
import { store } from "./store";

export default class ContentStore {
  categories: Category[] = [];
  articles: Article[] = [];
  profiles: Profile[] = [];
  userProfile: Profile | null = null;
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
    orderByLiked = false,
    token?: CancelToken
  ) => {
    try {
      const articles = await agent.requests.getWithCancel<Article[]>(
        `/Articles?category=${category}&orderByDate=${orderByDate}&orderByLikes=${orderByLiked}`,
        token
      );
      runInAction(() => (this.articles = articles));
    } catch (error) {
      console.log("error", error);
    }
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
    token,
  }: {
    titleQuery: string;
    bodyQuery: string;
    authorQuery: string;
    token: CancelToken;
  }) => {
    const articles = await agent.requests.getWithCancel<Article[]>(
      `/Articles/search?titleSubstring=${titleQuery}&bodySubstring=${bodyQuery}&authorNameSubstring=${authorQuery}`,
      token
    );

    runInAction(() => (this.articles = articles));
  };

  getProfiles = async (orderByArticleLikes = true) => {
    const profiles = await agent.requests.get<Profile[]>(
      `/Profiles?orderByArticleLikes=${orderByArticleLikes}`
    );
    runInAction(() => (this.profiles = profiles));
    runInAction(
      () =>
        (this.userProfile =
          profiles.find(
            (prof) => prof.username === store.userStore.user?.username
          ) || null)
    );
  };

  likeArticle = async (id: string) => {
    await agent.requests.put(`/Articles/like`, { articleId: id });
    this.getArticles();
  };

  saveArticle = async (id: string) => {
    await agent.requests.put(`/Articles/save`, { articleId: id });
    this.getSavedArticles();
  };

  updateProfile = async (formValues: ProfileFormValues) => {
    await agent.requests.put("/Profiles/update", formValues);
  };

  adminUpdateProfile = async (
    username: string,
    formValues: ProfileFormValues
  ) => {
    await agent.requests.put("/Profiles/admin-update", {
      targetUsername: username,
      ...formValues,
    });
  };
}
