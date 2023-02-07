import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/user";
import { store } from "./store";

export default class UserStore {
  user: User | null = null;
  isLoadingUser: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return !!this.user;
  }

  login = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.login(creds);
      store.commonStore.setToken(user.token);

      runInAction(() => (this.user = user));
      store.contentStore.getSavedArticles();
    } catch (error) {
      throw error;
    }
  };

  logout = () => {
    store.commonStore.setToken(null);
    window.localStorage.removeItem("jwt");
    this.user = null;
  };

  getUser = async () => {
    try {
      runInAction(() => (this.isLoadingUser = true));
      const user = await agent.Account.current();
      runInAction(() => (this.user = user));
      store.contentStore.getSavedArticles();
    } catch (error) {
      store.commonStore.setToken(null);
      window.localStorage.removeItem("jwt");
      console.log(error);
    } finally {
      runInAction(() => (this.isLoadingUser = false));
    }
  };

  register = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.register(creds);
      store.commonStore.setToken(user.token);
      runInAction(() => (this.user = user));
    } catch (error) {
      throw error;
    }
  };

  setDisplayName = (displayName: string) => {
    if (this.user) {
      this.user.displayName = displayName;
    }
  };
}
