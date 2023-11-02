import { prisma } from '@Lib/prisma';
import {
    Producto
} from '@prisma/client';

export default async function CreateProducto(props: Producto) {
    const dataProps = {
        ...props
    }
    const data = await prisma.producto.create({
        data: dataProps
    })
    .then((product) => {
        return ({
            status: "ok",
            error: undefined,
            data: product
        })
    })
    .catch((err) => ({
        status: "error",
        error: err,
        data: null
    }))
    
    return data;
}