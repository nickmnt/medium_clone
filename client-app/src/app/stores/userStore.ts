import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Profile } from "../models/profile";
import { User, UserFormValues } from "../models/user";
import { store } from "./store";

export default class UserStore {
  user: User | null = null;
  userProfile: Profile | null = null;
  isLoadingUser: boolean = false;
  roles: string[] = [];

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
      let claims = JSON.parse(atob(user.token.split(".")[1]));

      runInAction(() => (this.user = user));
      runInAction(
        () =>
          (this.roles =
            claims[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ])
      );
      await store.contentStore.getProfiles();
      console.log(store.contentStore.userProfile);

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

      let claims = JSON.parse(atob(user.token.split(".")[1]));

      runInAction(() => (this.user = user));
      runInAction(
        () =>
          (this.roles =
            claims[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ])
      );
      await store.contentStore.getProfiles();
      store.contentStore.getSavedArticles();
    } catch (error) {
      store.commonStore.setToken(null);
      window.localStorage.removeItem("jwt");
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
