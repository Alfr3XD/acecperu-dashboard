import { NextResponse } from "next/server";

import {
    getUser,
    getUsers
} from '@Controller/usuario/get'; 

export async function POST(req: Request) {
    const request = await req.json()
}