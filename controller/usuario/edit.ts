import { prisma } from '@Lib/prisma';
import { Usuario } from './type';

export default async function EditUser(user_id: number, user: Usuario) {
    const updateUser = await prisma.usuario.update({
        where: {
            id: user_id,
        },
        data: {
            name: user.name,
            password: user.password,
            role: user.role
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
    return updateUser;
}