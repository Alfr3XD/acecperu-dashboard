import { NextResponse } from "next/server";
import EditProducto from "@Controller/producto/edit";
import { Producto } from "@prisma/client";

export async function POST(req: Request) {

    const props = (await req.json()) as {id: number, data: Producto};

    const data = await EditProducto(props.id, props.data)
    
    switch (data.status) {
        case "ok":
            return NextResponse.json({
                data: data.data
            });
        case "error":
            return new NextResponse(
                JSON.stringify({
                    status: "error",
                    message: data.error,
                }),
                { status: 500 }
            );
    }
}
