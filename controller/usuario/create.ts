import { prisma } from '@Lib/prisma';
import { hash } from "bcryptjs";
import { Usuario } from './type';

interface UserProps {
    id?: number;
    name: string;
    password: string;
    role: string;
}

export default async function CreateUser(props: UserProps) {
    const { id, name, password, role } = props;

    const hashed_password = await hash(password, 12);

    const data = {
        password: hashed_password,
        name,
        role,
        id
    };

    const user = await prisma.usuario.create({
        data: data,
    })
    .then((user) => {
        return ({
            status: "ok",
            error: undefined,
            data: user
        })
    })
    .catch((err) => ({
        status: "error",
        error: err,
        data: null
    }))
    
    return user;
}