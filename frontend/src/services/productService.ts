import api from "./api";


export interface Product {

    id:number;

    name:string;

    categoryId:number;

    category?:{
        id:number;
        name:string;
    };

    unit:string;

    minimumStock:number;

    description?:string;

}



export const getProducts = async()=>{

    const response =
    await api.get("/products");


    return response.data;

};



export const createProduct = async(
    product:Product
)=>{


    const response =
    await api.post(
        "/products",
        product
    );


    return response.data;

};



export const updateProduct = async(

id:number,

product:Product

)=>{


    const response =
    await api.put(

        `/products/${id}`,

        product

    );


    return response.data;

};



export const deactivateProduct = async(

id:number

)=>{


    const response =
    await api.put(

        `/products/deactivate/${id}`

    );


    return response.data;

};