'use client'
import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";

export default function Provider ({
    children,
    session
}: {
    children: React.ReactNode
    session: any
}): React.ReactNode {
    return <SessionProvider session={session}>
        <NextUIProvider>
            {children}
        </NextUIProvider>
    </SessionProvider>
}