import { prisma } from '@Lib/prisma';
import {
    Auditoria,
} from '@prisma/client';

export default async function CreateAuditoria(props: Auditoria) {
    const dataProps = {
        ...props
    }

    console.log(dataProps)

    console.log()
    const data = await prisma.auditoria.create({
        data: dataProps
    })
    .then((data) => {
        return ({
            status: "ok",
            error: undefined,
            data
        })
    })
    .catch((err) => ({
        status: "error",
        error: err,
        data: null
    }))
    
    return data;
}