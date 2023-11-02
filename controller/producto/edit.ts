import { prisma } from '@Lib/prisma';
import { Producto } from '@prisma/client';

export default async function EditProducto(product_id: number, product: Producto) {
    const data = await prisma.producto.update({
        where: {
            id: product_id,
        },
        data: product
    })
    .then((data) => ({
        status: "ok",
        error: null,
        data: data
    }))
    .catch((err) => ({
        status: "error",
        error: err,
        data: null
    }))
    return data;
}