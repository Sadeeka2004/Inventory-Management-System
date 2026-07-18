import { Request, Response } from "express";
import prisma from "../lib/prisma";


// Get Products

export const getProducts = async (
req:Request,
res:Response
)=>{

try{


const products =
await prisma.product.findMany({

where:{
isActive:true
},

include:{
category:true
},

orderBy:{
id:"asc"
}

});


res.json(products);


}
catch(error){

console.log(error);

res.status(500).json({

message:"Error fetching products"

});

}


};




// Create Product

export const createProduct = async (

req:Request,

res:Response

)=>{

try{


const product =
await prisma.product.create({

data:{

name:req.body.name,
categoryId:Number(req.body.categoryId),
unit:req.body.unit,
minimumStock:Number(req.body.minimumStock),
description:req.body.description
}

});


res.status(201).json(product);


}
catch(error){

console.log(error);

res.status(500).json({

message:"Error creating product"

});

}


};




// Update Product

export const updateProduct = async (

req:Request,

res:Response

)=>{

try{


const {id}=req.params;


const product =
await prisma.product.update({

where:{
id:Number(id)
},

data:{
name:req.body.name,
categoryId:Number(req.body.categoryId),
unit:req.body.unit,
minimumStock:Number(req.body.minimumStock),
description:req.body.description
}

});


res.json(product);


}
catch(error){

console.log(error);

res.status(500).json({

message:"Error updating product"

});

}


};




// Deactivate Product

export const deactivateProduct = async (

req:Request,

res:Response

)=>{

try{


const {id}=req.params;


const product =
await prisma.product.update({

where:{
id:Number(id)
},

data:{

isActive:false

}

});


res.json({

message:"Product deactivated",

product

});


}
catch(error){

res.status(500).json({

message:"Error deactivating product"

});

}


};