import { prisma } from "@Lib/prisma";

export async function listAuditoria() {
    prisma.$connect();
    const users = await prisma.auditoria.findMany({
        include: {
            usuario: true
        }
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
    prisma.$disconnect()
    return users;
}