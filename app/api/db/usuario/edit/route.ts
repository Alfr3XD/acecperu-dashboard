import { NextResponse } from "next/server";
import EditUser from "@Controller/usuario/edit";

export async function POST(req: Request) {

    const {id, name, role, password } = (await req.json()) as {
        id: number;
        name: string;
        password: string;
        role: string
    };

    const data = await EditUser(id, {id, name, role, password})
    
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
