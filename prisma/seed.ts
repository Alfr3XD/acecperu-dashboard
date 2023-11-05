import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const username = process.env.USERNAME;
const user_password = process.env.PASSWORD;

async function main() {
    const password = await hash(user_password as string, 12);
    const user = await prisma.usuario.upsert({
        where: { name: username}, // Debe ser una condición única para identificar al usuario.
        update: {}, // Puedes dejar esto vacío si no necesitas actualizar nada.
        create: {
            name: "root", // Asegúrate de que el valor coincida con la condición única.
            password,
            role: "system"
        },
    });
    console.log({ user });
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });