import { prisma } from '@Lib/prisma';

export async function getUser(user_id: number) {
    const data = await prisma.usuario.findUnique({
        where: {
            id: user_id
        }
    })
    .then((user) => ({
        status: "ok",
        error: null,
        data: {
            id: user?.id,
            name: user?.name,
            role: user?.role
        }
    }))
    .catch((err) => ({
        status: "error",
        error: err,
        data: null
    }))
    return data;
}

export async function getUsers() {
    prisma.$connect();
    const users = await prisma.usuario.findMany()
    .then((user) => ({
        status: "ok",
        error: null,
        data: user.map((u) => ({id:u.id, name:u.name, role:u.role, createdTimestamp: u.createdTimestamp}))
    }))
    .catch((err) => ({
        status: "error",
        error: err,
        data: null
    }))
    prisma.$disconnect()
    return users;
}