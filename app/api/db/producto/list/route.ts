import { NextResponse } from "next/server";
import {
    getProductList
} from '@Controller/producto/get';

export async function POST() {
    const res = await getProductList();
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