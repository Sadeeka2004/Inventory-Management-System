import api from "./api";


export interface Supplier {

    id:number;

    shopName:string;

    contactPerson?:string;

    phone?:string;

    email?:string;

    address?:string;

}



export const getSuppliers = async () => {

    const response =
    await api.get("/suppliers");


    return response.data;

};



export const createSupplier = async (
    supplier:Supplier
) => {

    const response =
    await api.post(
        "/suppliers",
        supplier
    );


    return response.data;

};

export const updateSupplier = async (

id:number,

supplier:Supplier

)=>{


const response =
await api.put(

`/suppliers/${id}`,

supplier

);


return response.data;


};

export const deactivateSupplier = async(

id:number
)=>{

const response = 
await api.put(
`/suppliers/deactivate/${id}`
);

return response.data;
}