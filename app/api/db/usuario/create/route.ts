import CreateUser from '@Controller/usuario/create';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const request = (await req.json() as {
        id?: number;
        name: string;
        password: string;
        role: string;
    });


    const dataController = await CreateUser(request);
    
    switch (dataController.status) {
        case "ok":
            return NextResponse.json({
                user: {
                    name: dataController.data,
                },
            });
        case "error":
            return new NextResponse(
                JSON.stringify({
                    status: "error",
                    message: dataController.error,
                }),
                { status: 500 }
            );
    }
}