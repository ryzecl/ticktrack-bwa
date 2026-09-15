import { defineStore } from "pinia";
import { axiosInstance } from "@/plugins/axios";
import { handleError } from "@/helpers/errorHelper";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    statistic: null,
    loading: false,
    error: null,
    success: false,
  }),

  actions: {
    async fetchStatistics() {
      this.loading = true;

      try {
        const response = await axiosInstance.get("dashboard/statistics");
        this.statistic = response.data.data;
        this.success = response.data.message;
      } catch (error) {
        this.error = handleError(error);
        this.success = false;
      } finally {
        this.loading = false;
      }
    },
  },
});
