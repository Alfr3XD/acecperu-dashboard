import { NextResponse } from "next/server";
import DeleteProducto from "@Controller/producto/delete";

export async function POST(req: Request) {
    const { id } = (await req.json()) as {
        id: number;
    };

    const data = await DeleteProducto(Number(id));

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