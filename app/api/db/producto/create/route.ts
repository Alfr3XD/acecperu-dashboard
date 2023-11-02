import createProducto from '@Controller/producto/create';
import { NextResponse } from 'next/server';
import {
    Producto
} from '@prisma/client';

export async function POST(req: Request) {
    const request = (await req.json() as {
        props: Producto,
    });

    const dataController = await createProducto(request.props);

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