import api from "./axios";

export const getEmployees = () =>
    api.get("/emp/employees");

export const getEmployeeById = (id) =>
    api.get(`/emp/employees/${id}`);

export const createEmployee = (data) =>
    api.post("/emp/employees", data);

export const updateEmployee = (id, data) =>
    api.put(`/emp/employees/${id}`, data);

export const deleteEmployee = (id) =>
    api.delete("/emp/employees", {
        params: { eid: id }
    });

export const searchEmployees = (filters) =>
    api.get("/emp/employees/search", {
        params: filters
    });
