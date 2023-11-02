import { NextResponse } from "next/server";
import DeleteUser from "@Controller/usuario/delete";

export async function POST(req: Request) {
    const { id } = (await req.json()) as {
        id: number;
    };

    const data = await DeleteUser(Number(id));

    switch (data.status) {
        case "ok":
            return NextResponse.json({
                user: {
                    name: data.data,
                },
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