import { prisma } from '@Lib/prisma';

export async function getProduct(id: number) {
    const data = await prisma.producto.findUnique({
        where: { id }
    })
    .then((data) => ({
        status: "ok",
        error: null,
        data
    }))
    .catch((err) => ({
        status: "error",
        error: err,
        data: null
    }))
    return data;
}

export async function getProductList() {
    const data = await prisma.producto.findMany()
    .then((data) => ({
        status: "ok",
        error: null,
        data
    }))
    .catch((err) => ({
        status: "error",
        error: err,
        data: null
    }))
    return data;
}