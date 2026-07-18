import { Request, Response } from "express";
import prisma from "../lib/prisma";


// Create Supplier

export const createSupplier = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            shopName,
            contactPerson,
            phone,
            email,
            address
        } = req.body;


        const supplier = await prisma.supplier.create({

            data: {

                shopName,
                contactPerson,
                phone,
                email,
                address

            }

        });


        res.status(201).json(supplier);


    } catch(error) {


        res.status(500).json({

            message:"Error creating supplier"

        });


    }

};




// Get All Suppliers

export const getSuppliers = async (

    req: Request,

    res: Response

) => {


    try {


        const suppliers =
        await prisma.supplier.findMany({
            where:{
                isActive:true
            }
        });


        res.json(suppliers);



    } catch(error){


        res.status(500).json({

            message:"Error fetching suppliers"

        });


    }


};

export const updateSupplier = async (
    req: Request,
    res: Response
) => {

    try {

        const { id } = req.params;


        const supplier =
        await prisma.supplier.update({

            where:{
                id:Number(id)
            },

            data:req.body

        });


        res.json(supplier);


    } catch(error){

        res.status(500).json({

            message:"Error updating supplier"

        });

    }

};

export const deactivateSupplier = async (

req: Request,

res: Response

) => {


try {


const { id } = req.params;



const supplier =
await prisma.supplier.update({

where:{
id:Number(id)
},


data:{

isActive:false

}


});



res.json({

message:"Supplier deactivated",

supplier

});



}
catch(error){


res.status(500).json({

message:"Error deactivating supplier"

});


}


};