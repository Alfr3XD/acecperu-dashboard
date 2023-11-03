'use client';
import { Auditoria, Usuario as UserProps, Usuario } from "@prisma/client";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Pagination, Select, SelectItem } from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import _ from "lodash"; 
import { Key, useEffect, useState } from "react";
import { BiChevronDown, BiSolidUser } from "react-icons/bi";
import { formatoFechaModificacion } from "@Lib/FechaFormat";
import {
    AiTwotoneDelete
} from "react-icons/ai";
import {
    MdAddBox, MdTipsAndUpdates
} from "react-icons/md";
import {
    BsFillBookmarkFill, BsFillCalendarFill
} from 'react-icons/bs';

interface AuditoriaExtends extends Auditoria {
    usuario: Usuario
}

export default function ConfigPage() {
    const [auditoria, setAuditoria] = useState<AuditoriaExtends[]>([])
    const [usuariosDrop, setUsuarios] = useState<string[]>([]);
    const [filterTable, setFilterTable] = useState<'all' | Set<Key>>("all");
    const [filterAction, setFilterAction] = useState<'all' | Set<Key>>("all");
    const [filterUser, setFilterUser] = useState<'all' | Set<Key>>("all");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 

    const { data: session } = useSession();
    const Session = (session?.user as UserProps);

    const getAuditoria = async () => {
        const res = await fetch('/api/db/auditoria/list', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })

        const data = (await res.json() as AuditoriaExtends[]);
        setAuditoria(data)
    }

    const auditoriaData = auditoria.filter((x) => {
        const tableFilterPass =
            filterTable === "all" || filterTable.has(x.tabla_afectada);
        const actionFilterPass =
            filterAction === "all" || filterAction.has(x.tipo_operacion);
        const userFilterPass =
            filterUser === "all" || filterUser.has(x.usuario.name);
        return tableFilterPass && actionFilterPass && userFilterPass;
    })
    .sort((a, b) => new Date(b.fecha_modificacion.toString()).getTime() - new Date(a.fecha_modificacion.toString()).getTime()) ;

    const totalPages = Math.ceil(auditoriaData.length / itemsPerPage);
    const paginatedAuditoria = _.chunk(auditoriaData, itemsPerPage);

    const currentAuditoriaPage = paginatedAuditoria[currentPage - 1];


    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        getAuditoria()
    }, [])

    useEffect(() => {
        GetUsers()
    }, [])

    const validationRoles = ["system", "admin"];
    if(!validationRoles.includes((session?.user as {role: string}).role)) {
        return (
            <div className="h-full px-8">
                <h1 className="text-4xl text-center font-bold pt-40">
                    ERROR 401
                </h1>
                <p className='text-center mt-4'> NO TIENES PERMISOS PARA ACCEDER A ESTE CONTENIDO </p>
            </div>
        )
    }

    const Operaciones = ({prop}: {prop: "INSERT" | "UPDATE" | "DELETE" }) => {
        const ae = {
            "INSERT": <MdAddBox className="w-10 h-10 text-green-700" />,
            "UPDATE": <MdTipsAndUpdates className="w-10 h-10 text-yellow-500"/>,
            "DELETE": <AiTwotoneDelete className="w-10 h-10 text-red-700" />,        
        }

        return ae[prop as "INSERT" | "UPDATE" | "DELETE"]
    }

    const tables = [
        "Usuarios",
        "Inventario"
    ]
    const actions = [
        {uid: "INSERT", name: "Creación"},
        {uid: "UPDATE", name: "Actualización"},
        {uid: "DELETE", name: "Eliminación"}
    ]
    
    const GetUsers = async() => {
        try {
            const res = await fetch('/api/db/usuario/list', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            })
            
            if(res.ok) {
                const content  = (await res.json() as Usuario[]);
                setUsuarios(content.map(x => x.name))
            }
        }
        catch(error) {
            setUsuarios([])
        }
    }

    

    return (
        <main className="max-w-screen-2xl container mx-auto px-4 h-full">
            <div className="flex flex-wrap gap-10 justify-between items-center">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-semibold"> Auditoría </h1>
                    <p className="opacity-60"> Eventos registrados en el dashboard </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Dropdown>
                        <DropdownTrigger className="bg-white border border-black/10 hover:bg-slate-100">
                            <Button
                                endContent={<BiChevronDown className="text-small" />}
                                variant="flat"
                            >
                                Filtrar por tabla
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Row Columns Filter"
                            closeOnSelect={false}
                            selectedKeys={filterTable}
                            selectionMode="multiple"
                            onSelectionChange={setFilterTable}
                        >
                            {tables.map((data) =>
                                <DropdownItem key={data} className="capitalize">
                                    {data}
                                </DropdownItem>
                            )}
                        </DropdownMenu>
                    </Dropdown>

                    <Dropdown>
                        <DropdownTrigger className="bg-white border border-black/10 hover:bg-slate-100">
                            <Button
                                endContent={<BiChevronDown className="text-small" />}
                                variant="flat"
                            >
                                Filtrar por acción
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Row Columns Filter"
                            closeOnSelect={false}
                            selectedKeys={filterAction}
                            selectionMode="multiple"
                            onSelectionChange={setFilterAction}
                        >
                            {actions.map((data) =>
                                <DropdownItem key={data.uid} className="capitalize">
                                    {data.name}
                                </DropdownItem>
                            )}
                        </DropdownMenu>
                    </Dropdown>

                    <Dropdown>
                        <DropdownTrigger className="bg-white border border-black/10 hover:bg-slate-100">
                            <Button
                                endContent={<BiChevronDown className="text-small" />}
                                variant="flat"
                            >
                                Filtrar por usuario
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Row Columns Filter"
                            closeOnSelect={false}
                            selectedKeys={filterUser}
                            selectionMode="multiple"
                            onSelectionChange={setFilterUser}
                        >
                            {usuariosDrop.map((x) => 
                                <DropdownItem key={x} className="capitalize">
                                    {x}
                                </DropdownItem>
                            )}
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
            <div className="flex flex-col gap-4 mt-8">
                {currentAuditoriaPage?.map((x, i) => 
                        <div key={i} className="p-4 bg-white rounded-2xl border border-black/10">
                            <h1 className="text-2xl font-bold uppercase"> Tabla {x.tabla_afectada} </h1>
                            <div className="flex items-center gap-4 text-black/60">
                                <Operaciones prop={x.tipo_operacion} />
                                <ul>
                                    <li className="text-xl font-bold flex items-center gap-3"> 
                                        <BiSolidUser className="w-4 h-4" />
                                        <span> {x.usuario.name} </span> 
                                    </li>
                                    <li className="flex items-center gap-3"> 
                                        <BsFillBookmarkFill className="w-4 h-4" />
                                        <p> {x.cambios} </p>
                                    </li>
                                    <li className="flex items-center gap-3 font-semibold italic"> 
                                        <BsFillCalendarFill className="w-4 h-4" />
                                        <span>{formatoFechaModificacion(new Date(x.fecha_modificacion), true)}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )
                }
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    total={totalPages}
                    color="primary"
                    page={currentPage}
                    onChange={handlePageChange}
                />
            </div>
        </main>
    )
}