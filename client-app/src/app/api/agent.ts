import axios, { AxiosError, AxiosResponse, CancelToken } from "axios";
import { PaginatedResult } from "../models/pagination";
import { User, UserFormValues } from "../models/user";
import { store } from "../stores/store";

axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || "https://localhost:5000/api";

console.log(process.env.REACT_APP_API_URL);
const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use((config) => {
  const token = store.commonStore.token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    if (process.env.NODE_ENV === "development") await sleep(200);
    const pagination = response.headers["pagination"];
    if (pagination) {
      response.data = new PaginatedResult(
        response.data,
        JSON.parse(pagination)
      );
      return response as AxiosResponse<PaginatedResult<any>>;
    }
    return response;
  },
  (error: AxiosError<string>) => {
    return Promise.reject(error);
  }
);

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  getWithCancel: <T>(url: string, token?: CancelToken) =>
    axios.get<T>(url, { cancelToken: token }).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string, body: {} = {}) =>
    axios.delete<T>(url, { data: body }).then(responseBody),
};

const Account = {
  current: () => requests.get<User>("/Account"),
  login: (user: UserFormValues) => requests.post<User>("/Account/login", user),
  register: (user: UserFormValues) =>
    requests.post<User>("/Account/register", user),
};

const agent = {
  requests,
  Account,
};

export default agent;
