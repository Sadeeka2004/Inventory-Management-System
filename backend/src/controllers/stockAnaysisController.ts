import { Request, Response } from "express";
import prisma from "../lib/prisma";


// Get Current Stock

export const getCurrentStock = async (
    req: Request,
    res: Response
) => {

    try {

        const products = await prisma.product.findMany({

            include:{
                transactions:true
            }

        });


        const stock = products.map(product => {


            const totalIn =
            product.transactions
            .filter(t => t.type === "IN")
            .reduce(
                (sum,t) => sum + t.quantity,
                0
            );


            const totalOut =
            product.transactions
            .filter(t => t.type === "OUT")
            .reduce(
                (sum,t) => sum + t.quantity,
                0
            );


            return {

                productId: product.id,

                productName: product.name,

                availableStock:
                totalIn - totalOut

            };


        });


        res.json(stock);


    } catch(error){

        res.status(500).json({

            message:"Error calculating stock"

        });

    }

};