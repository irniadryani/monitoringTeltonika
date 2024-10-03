import { Api } from "../../common/api";

export const kelolaClientFn = async () => {
  const response = await Api.get("/api/clients");
  return response.data;
};

export const insertClientFn = async (data) => {
  const response = await Api.post("/api/clients", data);
  return response.data;
};

export const singleClientFn = async (id) => {
  const response = await Api.get(`/api/clients/${id}`);
  return response.data;
};

export const updateClientFn = async (id, data) => {
  const response = await Api.put(`/api/clients/${id}`, data);
  return response.data;
};

export const suspendFn = async (id, data) => {
  const response = await Api.put(`/api/clients/suspend?id=${id}`, data);
  return response.data;
};

export const restoreFn = async (id, data) => {
	const response = await Api.put(`/api/clients/restore?id=${id}`, data);
	return response.data;
  };
  
