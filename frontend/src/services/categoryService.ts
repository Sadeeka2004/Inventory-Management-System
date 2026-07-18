import api from "./api";

export interface Category {
    id: number;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get("/categories");
    return response.data;
};

export const createCategory = async (data: { name: string }): Promise<Category> => {
    const response = await api.post("/categories", data);
    return response.data;
};

export const updateCategory = async (id: number, data: { name: string }): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id: number) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
};