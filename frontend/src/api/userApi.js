import api from "./axios";

export const signup = (data) =>
    api.post("/user/signup", data);

export const login = (data) =>
    api.post("/user/login", data);
