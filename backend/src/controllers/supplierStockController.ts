import { Request, Response } from "express";
import prisma from "../lib/prisma";


export const getSupplierWiseStock = async (
    req: Request,
    res: Response
) => {

    try {


        const supplierProducts =
        await prisma.supplierProduct.findMany({

            include:{
                supplier:true,
                product:true
            }

        });


        const result =
        supplierProducts.map(item => {


            return {

                supplier:
                item.supplier.shopName,

                product:
                item.product.name,

                purchasePrice:
                item.purchasePrice


            };


        });


        res.json(result);


    } catch(error){

        res.status(500).json({

            message:
            "Error loading supplier stock"

        });

    }

};