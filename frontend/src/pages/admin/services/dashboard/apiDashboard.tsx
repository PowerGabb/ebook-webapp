import { apiCall } from "@/lib/api";

export async function getDashboardData() {
    const response = await apiCall("/dashboard", {
        method: "GET",
    });
    return response;
}

