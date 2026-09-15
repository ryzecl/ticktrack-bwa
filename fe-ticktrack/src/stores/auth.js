import { defineStore } from "pinia";
import { axiosInstance } from "@/plugins/axios";
import { handleError } from "@/helpers/errorHelper";
import router from "@/router";
import Cookies from "js-cookie";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loading: false,
    error: null,
    success: false,
  }),

  getters: {
    token: () => Cookies.get("token"),
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.post("/login", credentials);
        const token = response.data.data.token;
        Cookies.set("token", token);
        this.success = response.data.message;

        if (response.data.data.user.role == "admin") {
          router.push({ name: "admin.dashboard" });
        } else {
          router.push({ name: "app.dashboard" });
        }
      } catch (error) {
        this.error = handleError(error);
        this.success = false;
      } finally {
        this.loading = false;
      }
    },

    async register(credentials) {
      this.loading = true;

      try {
        const response = await axiosInstance.post("/register", credentials);

        this.success = response.data.message;
        const token = response.data.data.token;
        Cookies.set("token", token);
        router.push({ name: "app.dashboard" });
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true;

      try {
        const response = await axiosInstance.post("/logout");
        Cookies.remove("token");

        this.user = null;
        this.error = null;

        this.success = response.data.message;

        router.push({ name: "login" });
      } catch (error) {
        this.error = handleError(error);
        this.success = false;
      } finally {
        this.loading = false;
      }
    },

    async checkAuth() {
      // TODO: Implement checkAuth action
      // Steps:
      // 1. Set loading state
      // 2. Make API call to get user data
      // 3. Update user state
      // 4. Handle unauthorized error
    },
  },
});
