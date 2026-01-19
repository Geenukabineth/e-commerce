import axios,{AxiosError} from "axios";
import type { Tokens } from "./types";


const BASE_URL = "http://127.0.0.1:8000/api"; 


export const http =axios.create({
    baseURL: BASE_URL,
    timeout: 150000,
})

const ACCESS_KEY = "access";
const REFRESH_KEY = "refresh";

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (t: Tokens) => {
    localStorage.setItem(ACCESS_KEY, t.access);
    localStorage.setItem(REFRESH_KEY, t.refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};


http.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
let isRefreshing = false;
let pending: Array<(token: string | null) => void> = [];

function subscribe(cb: (token: string | null) => void) {
  pending.push(cb);
}
function publish(token: string | null) {
  pending.forEach((cb) => cb(token));
  pending = [];
}
http.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const original = err.config as any;

    // If not 401 or already retried, throw
    if (err.response?.status !== 401 || original?._retry) {
      throw err;
    }
    original._retry = true;

    const refresh = tokenStore.getRefresh();
    if (!refresh) {
      tokenStore.clear();
      throw err;
    }
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribe((newToken) => {
          if (!newToken) return reject(err);
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(http(original));
        });
      });
    }

    isRefreshing = true;
    try {
      const refreshRes = await axios.post(`${BASE_URL}/accounts/refresh/`, { refresh });
      const newAccess = (refreshRes.data as { access: string }).access;

      tokenStore.set({ access: newAccess, refresh });
      publish(newAccess);

      original.headers.Authorization = `Bearer ${newAccess}`;
      return http(original);
    } catch (e) {
      tokenStore.clear();
      publish(null);
      throw e;
    } finally {
      isRefreshing = false;
    }
  }
);