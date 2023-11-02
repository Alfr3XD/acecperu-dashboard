import { listAuditoria } from "@Controller/auditoria/list";
import { NextResponse } from "next/server";

export async function POST() {
    const res = await listAuditoria();
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