import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import ContentStore from "./contentStore";
import UserStore from "./userStore";

interface Store {
  commonStore: CommonStore;
  userStore: UserStore;
  contentStore: ContentStore;
}

export const store: Store = {
  commonStore: new CommonStore(),
  userStore: new UserStore(),
  contentStore: new ContentStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
