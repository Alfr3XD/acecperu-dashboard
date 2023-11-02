import { NextResponse } from 'next/server';
import {
    Auditoria
} from '@prisma/client';
import CreateAuditoria from '@Controller/auditoria/create';

export async function POST(req: Request) {
    const request = (await req.json() as Auditoria);

    const dataController = await CreateAuditoria(request)

    switch (dataController.status) {
        case "ok":
            return NextResponse.json({
                data: dataController.data
            });
        case "error":
            console.error(dataController.error)
            return new NextResponse(
                JSON.stringify({
                    status: "error",
                    message: dataController.error,
                }),
                { status: 500 }
            );
    }
}