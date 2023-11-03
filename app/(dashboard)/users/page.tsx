'use client';
import {
    useEffect,
    useState
} from "react";
import TableComponent from '@Components/content/Table';
import {
    useSession
} from "next-auth/react";
import { Usuario } from "@Controller/usuario/type";

export default function Page() {
    const [Columns, setColumns] = useState<string[]>([]);
    const [Rows, setRows] = useState<Usuario[] | []>([]);
    const [isLoading, setLoading] = useState(true);
    const [selectedRows, setSelectAllChecked] = useState<Usuario[]>();

    const {data: session} = useSession();
    const Session = (session?.user as Usuario);

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
                const columns = Object.keys(content[0]).filter((x) => x !== "createdTimestamp")
                setColumns(columns);
                setRows(content)
                setLoading(false);
            }
        }
        catch(error) {
            setRows([])
        }
    }

    const createAuditoriasa = async (id: number, name: string) => {
        const body = {
            tabla_afectada: "Usuarios",
            tipo_operacion: "DELETE",
            cambios: `Eliminó al usuario con Id: ${id} - ${name}`,
            usuario_id: Number(Session.id)
        }


        const res = await fetch('/api/db/auditoria/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
    }

    const DeleteUser = async(id: number) => {
        try {
            const res = await fetch('/api/db/usuario/delete', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: id})
            })
            const data = await res.json()
            if(res.ok) {
                GetUsers();
                await createAuditoria({
                    user_id: Number(Session.id),
                    table: {
                        title: "Usuarios",
                        content: `eliminó al usuario con Id: ${data.user.name.id} - ${data.user.name.name}`,
                    },
                    operation: "DELETE"
                })
            } else {
                return;
            }
            
        }
        catch(error) {
            return;
        }
    }

    useEffect(() => {
        GetUsers();
    }, []); 

    async function DeleteUsers() {
        if(selectedRows) {
            for (const row of selectedRows) {
                DeleteUser(row.id as number)
            }
        }
    }

    function HeadContent() {
        return Columns.map((item) => {
            switch(item) {
                case "id":
                    return {
                        uid: item,
                        name: "ID",
                        sortable: true
                    }
                case "name":
                    return {
                        uid: item,
                        name: "NOMBRE",
                        sortable: true
                    }
                case "role":
                    return {
                        uid: item,
                        name: "ROL",
                        sortable: true
                    }
                default:
                    return {
                        uid: item,
                        name: item.toUpperCase(),
                    }
            }
        })
    }

    const customCellsRender = {

        name: (value: string) => session?.user?.name === value ?
            <div className="flex items-center gap-2 font-semibold">
                <span> {value} </span>

                <span className="px-1.5 py-0.5 bg-gradient-to-tr to-blue-800 from-teal-700 rounded-md text-[10px] text-white"> YOU </span>
            </div>  :
            <span className="font-semibold">
                {value}
            </span>
        ,
        password: (value: string) => 
            <div className="">
                *************
            </div>
        ,
        role: (value: string) => {
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
        }
    };

    const filterColumns = {
        column: {
            uid: "role",
            name: "Filtro de Rol"
        },
        options: [
            { name: "Sistema", uid: "system" },
            { name: "Administradores", uid: "admin" },
            { name: "Gestionadores", uid: "manager" },
            { name: "Usuarios", uid: "user"}
        ]
    };

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

    const disabledRoles = ["admin"];
    const disabledKeysForRoles: string[] = []
    if((session?.user as {role: string}).role === "admin") {
        const filtered = Rows.filter((user: Usuario) => disabledRoles.includes(user.role)).map(x => String(x.id))
        disabledKeysForRoles.push(...filtered)
    }
    
    return (
        <>
            <main className="max-w-screen-2xl h-full container mx-auto p-4">
                <div className="flex flex-col gap-2 mb-4">
                    <h1 className="text-4xl font-semibold"> Usuarios </h1>
                    <p className="opacity-60"> Controla y administra los usuarios que pueden tener acceso a este dashboard. </p>
                </div>
                <div className="flex flex-col gap-5">
                    {!isLoading ?
                        <>                         
                            <div className="w-full">
                                <TableComponent
                                    columns={HeadContent()}
                                    data={Rows}
                                    serchColumnFilter="name"
                                    selectedColumnsKey={setSelectAllChecked}
                                    emptyBody="No se encontraron usuarios"
                                    searchPlaceholder="Buscar a usuarios por nombre..."
                                    keyTarget="id"
                                    isLoading={isLoading}
                                    customCellsRender={customCellsRender}
                                    callbackAddButton="users/add"
                                    disabledKeys={["1", (session?.user as {id: string}).id, ...disabledKeysForRoles]}
                                    disabledEditKeys={["1", (session?.user as {id: string}).id, ...disabledKeysForRoles]}
                                    callbackDeleteButton={DeleteUsers}
                                    callbackDeleteButtonColumn={DeleteUser}
                                    callbackEditButton={(x) => `users/${x.id}`}
                                    filterColumn={filterColumns}
                                />   
                            </div>
                            <div className="grid grid-cols-4 gap-4 ">
                                <div className="col-span-4 lg:col-span-1 bg-white rounded-3xl p-4 border border-black/10">
                                    <PieComp
                                        Rows={Rows}
                                    />
                                </div>
                                <div className="col-span-4 lg:col-span-3 bg-white rounded-3xl p-4 border border-black/10">
                                    <AreaChart Rows={Rows}/>
                                </div>
                                
                            </div>
                        </>
                        :
                        <></>
                    }
                </div>
            </main>
        </>
    )
}

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    PointElement,
    LineElement,
    Filler,
} from 'chart.js';
import {
    Pie,
    Bar,
    Line
} from 'react-chartjs-2';
import { createAuditoria } from "@Controller/auditoria/api";

const AreaChart = ({
    Rows
}: {Rows: Usuario[]}) => {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Filler,
        Legend
    );
      
    const usersByMonth: Record<string, number> = {};
    Rows.forEach((user) => {
        const createdDate = new Date(user.createdTimestamp);
        const month = createdDate.toLocaleString('es', { month: 'long' });
        usersByMonth[month] = (usersByMonth[month] || 0) + 1;
    });
      
    const labels = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
      const data = {
        labels,
        datasets: [
          {
            fill: true,
            label: 'Usuarios creados por mes',
            data: labels.map((month) => usersByMonth[month.toLocaleLowerCase()] || 0),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
    };
    
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom' as const,
          },
          title: {
            display: true,
            text: 'Usuarios creados por mes',
          },
        },
        maintainAspectRatio: false,
    };
    
    return <Line className="w-full h-full" options={options} data={data} />;
}
const PieComp = ({
    Rows
}: {Rows: Usuario[]}) => {
    ChartJS.register(ArcElement, Tooltip, Legend);
    const values = contarUsuariosPorRol(Rows);
    const labels = obtenerRolesRegistrados(Rows);
    const roleColors = {
        'system': 'rgba(63, 63, 70, 0.8)',
        'admin': 'rgba(29, 78, 216, 0.8)',
        'manager': 'rgba(8, 145, 178, 0.8)',
        'user': 'rgba(21, 215, 77, 0.8)',
    };

    const backgroundColor = labels.map((role) => roleColors[role as keyof typeof roleColors] || 'defaultColor');
    
    const data = {
        labels: labels,
        datasets: [
          {
            label: 'Cantidad',
            data: values,
            backgroundColor: backgroundColor,
            borderWidth: 1,
          },
        ],
      };
    return <Pie className="w-full h-full" options={{
        maintainAspectRatio: false,
    }} data={data} />;
    
}

function contarUsuariosPorRol(usuarios: Usuario[]): number[] {
    const conteoRoles: { [rol: string]: number } = {};

    usuarios.reduce((conteo, usuario) => {
        const { role } = usuario;
        if (conteo[role]) {
            conteo[role]++;
        } else {
            conteo[role] = 1;
        }
        return conteo;
    }, conteoRoles);

    return Object.values(conteoRoles);
}

function obtenerRolesRegistrados(usuarios: Usuario[]): string[] {
    const rolesRegistrados: string[] = [];

    usuarios.forEach((usuario) => {
        const { role } = usuario;
        if (!rolesRegistrados.includes(role)) {
            rolesRegistrados.push(role);
        }
    });

    return rolesRegistrados;
}