import { prisma } from '@Lib/prisma';

export default async function DeleteUser(id: number) {
    const user = await prisma.usuario.delete({
        where: {
            id: id
        }
    })
    .then((user) => ({
        status: "ok",
        error: null,
        data: user
    }))
    .catch((err) => ({
        status: "error",
        error: err,
        data: null
    }))
        
    return user
}