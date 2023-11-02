import { prisma } from '@Lib/prisma';

export default async function DeleteProducto(id: number) {
    console.log(id)
    const data = await prisma.producto.delete({
        where: {
            id: id
        }
    })
    .then((product) => ({
        status: "ok",
        error: null,
        data: product
    }))
    .catch((err) => ({
        status: "error",
        error: err,
        data: null
    }))
        
    return data;
}