'use client';
import { Usuario as UserProps } from "@prisma/client";
import { Button } from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";

import {
    IoIosExit
} from 'react-icons/io';


export default function ConfigPage() {
    const { data: session, update } = useSession();
    const Session = (session?.user as UserProps);

    const CustomCellsRender = ({value}: {value: string}) => {
        switch(value) {
            case "system": 
                return <div className="px-3 py-1 bg-gradient-to-tr from-zinc-700 to-zinc-400 text-white rounded-lg w-fit text-xs font-bold uppercase"> {value} </div>
            case "admin": 
                return <div className="px-3 py-1 bg-gradient-to-tr from-blue-700 to-sky-700 text-white rounded-lg w-fit text-xs font-bold uppercase"> {value} </div>
            case "user": 
                return <div className="px-3 py-1 bg-gradient-to-tr from-green-700 to-lime-500 text-white rounded-lg w-fit text-xs font-bold uppercase"> {value} </div>
            case "manager":
                return <div className="px-3 py-1 bg-gradient-to-tr from-cyan-600 to-teal-600 text-white rounded-lg w-fit text-xs font-bold uppercase"> {value} </div>
            default:
                return <div className="px-3 py-1 bg-black/10 rounded-lg w-fit text-xs font-bold uppercase"> {value} </div>
        } 
    };

    return (
        <main className="max-w-screen-2xl container mx-auto px-4 h-full">
            <h1 className="text-4xl font-bold"> Tu perfil </h1>
            <div className="flex flex-col-reverse gap-10 mt-8">
                <div className="flex flex-col gap-3">
                    
                    <div className="flex items-center gap-2">
                        <strong> ID de usuario: </strong>
                        <span> {Session.id} </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <strong> Nombre de usuario: </strong>
                        <span> {Session.name} </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <strong> Permisos rol: </strong>
                        <CustomCellsRender value={Session.role} />
                    </div>

                    <Button
                        startContent={<IoIosExit />}
                        onClick={() => signOut({ redirect: true, callbackUrl: '/' }) }
                        className='bg-red-600 hover:bg-red-700 text-white font-semibold transition-all text-md w-fit mt-4'
                    >
                        Cerrar sesión
                    </Button>
                </div>
            </div>
        </main>
    )
}