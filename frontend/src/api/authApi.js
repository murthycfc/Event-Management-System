import axios from "axios";
import apiClient from "./apiClient";

const BASE_URL = "http://localhost:8080";

export async function register(inputs) {
    const response = await axios.post(`${BASE_URL}/auth/register`, inputs);
    return response.data;
}

export async function login(inputs) {
    const response = await axios.post(`${BASE_URL}/auth/login`, inputs);
    return response.data;
}

export async function logout() {
    const response = await apiClient.post(`/auth/logout`);
    return response.data;
}