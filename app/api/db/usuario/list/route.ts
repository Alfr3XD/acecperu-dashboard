import { NextResponse } from "next/server";
import {
    getUsers
} from '@Controller/usuario/get';

export async function POST() {
    const res = await getUsers();
    switch (res.status) {
        case "ok":
            return Response.json(res.data)
        case "error":
            return new NextResponse(
                JSON.stringify({
                    status: "error",
                    message: res.error,
                }),
                { status: 500 }
            );
    }
}