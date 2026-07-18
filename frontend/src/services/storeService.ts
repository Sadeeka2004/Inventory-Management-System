import api from "./api";

export interface Store {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  manager?: string;
}

export const getStores = async () => {
  const response = await api.get("/stores");
  return response.data;
};

export const createStore = async (store: Store) => {
  const response = await api.post("/stores", store);
  return response.data;
};

export const updateStore = async (
  id: number,
  store: Store
) => {
  const response = await api.put(`/stores/${id}`, store);
  return response.data;
};

export const deactivateStore = async (id: number) => {
  const response = await api.put(
    `/stores/deactivate/${id}`
  );
  return response.data;
};