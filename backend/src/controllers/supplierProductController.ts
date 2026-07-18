import { Request, Response } from "express";
import prisma from "../lib/prisma";


// Assign product to supplier

export const assignProductToSupplier = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            supplierId,
            productId,
            purchasePrice
        } = req.body;


        const supplierProduct =
        await prisma.supplierProduct.create({

            data: {

                supplierId,
                productId,
                purchasePrice

            }

        });


        res.status(201).json(supplierProduct);


    } catch(error) {

        res.status(500).json({

            message:"Error assigning product to supplier"

        });

    }

};



// Get suppliers of a product

export const getProductSuppliers = async (
    req: Request,
    res: Response
) => {

    try {

        const { productId } = req.params;


        const suppliers =
        await prisma.supplierProduct.findMany({

            where:{
                productId:Number(productId)
            },

            include:{
                supplier:true
            }

        });


        res.json(suppliers);


    } catch(error){

        res.status(500).json({

            message:"Error fetching suppliers"

        });

    }

};
