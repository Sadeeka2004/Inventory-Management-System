import api from "./api";

export const getInventoryAlerts =
async () => {

    const response =
       await api.get(
          "/inventory-alerts"
       );
    return response.data;

};