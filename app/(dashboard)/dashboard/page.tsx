'use client';
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

import {
    MdCategory
} from 'react-icons/md';
import {
    BiSolidPackage
} from 'react-icons/bi';
import {
    FaUsers
} from 'react-icons/fa';

export default function Page() {

    const {data: session} = useSession();

    const cards = [
        {
            href: "/products",
            title: "Productos",
            description: "Administra los productos",
            icon: BiSolidPackage 
        },
        {
            href: "/categories",
            title: "Categorías",
            description: "Crea categorías para tu producto",
            icon: MdCategory
        },
    ];

    const rolesValidation = ["system", "admin"];
    if(rolesValidation.includes((session?.user as {role: string}).role)) {
        cards.push({
            href: "/users",
            title: "Usuarios",
            description: "Administra a los usuarios",
            icon: FaUsers
        })
    }

    return (
        <main className="max-w-screen-2xl h-full container mx-auto p-4">

            <h1 className="font-semibold text-5xl"> Bienvenido {session?.user?.name} ✨</h1>
            <p className="mt-4 opacity-80"> Empieza a explorar el entorno de gestión de Acec Perú. </p>

            <section className="grid grid-cols-3 gap-3 mt-10">
                {cards.map((card, i) => 
                    <Card 
                        key={i}
                        {...card}
                    />
                )}
            </section>
        </main>
    )
}

function Card({ title, description, href, icon }: {
    title: string,
    description: string,
    href: string,
    icon: any
}) {
    const Icon = icon;

    return <Link href={href} className="transition-all container p-4 rounded-lg bg-white border border-black/20 shadow-lg hover:scale-110 hover:brightness-75">
        <div className="flex items-center gap-4">
            <Icon className="w-16 h-16 text-amber-600" />
                <div>
                    <h1 className="text-3xl font-bold uppercase"> {title} </h1>
                    <p className="mt-2 opacity-75"> {description} </p>
                </div>
            </div>
    </Link>
}