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
import { Button } from "@nextui-org/react";
import { Producto, Usuario } from "@prisma/client";
import { useState, useEffect } from "react";

export default function Page() {

    const [products, setProducts] = useState<Producto[]>([]);
    const [users, setUsers] = useState<Usuario[]>([]);

    const {data: session} = useSession();
    const Session = (session?.user as Usuario);
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

    const GetProductos = async() => {
        try {
            const res = await fetch('/api/db/producto/list', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            })
            
            if(res.ok) {
                const content  = (await res.json() as Producto[]);
                setProducts(content)
            } 
        }
        catch(error) {
            setProducts([])
        }
    }

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
                setUsers(content)
            }
        }
        catch(error) {
            setUsers([])
        }
    }

    useEffect(() => {
        GetProductos()
    }, [])

    useEffect(() => {
        GetUsers()
    }, [])

    return (
        <main className="max-w-screen-2xl h-full container mx-auto p-4">

            <h1 className="font-semibold text-5xl"> Bienvenido {session?.user?.name} ✨</h1>
            <p className="mt-4 opacity-80"> Empieza a explorar el entorno de gestión de Acec Perú. </p>

            <section className="mt-10 ">
                <div className="flex items-center gap-3 pb-4">
                    <h1 className="text-2xl font-bold"> Productos </h1>
                    <Link href="/products" className="underline underline-offset-2">
                        ver productos
                    </Link>
                </div>
                <div className="grid grid-cols-6 grid-rows-6 gap-3">
                    <div className="col-span-1 row-span-3 bg-white p-4 rounded-2xl border border-black/10 text-center flex">
                        <div className="m-auto">
                            <h1> Productos registrado </h1>
                            <strong className="text-5xl"> {products.length} </strong>
                        </div>
                    </div>  

                    <div className="col-span-2 row-span-6 bg-white p-4 rounded-2xl border border-black/10 text-center">
                        <PieComp Rows={products} />
                    </div> 

                    <div className="col-span-3 row-span-6 bg-white p-4 rounded-2xl border border-black/10 text-center">
                        <AreaChart Rows={products} />
                    </div> 

                    <div className="col-span-1 row-span-3 bg-white p-4 rounded-2xl border border-black/10 text-center flex">
                        <div className="m-auto">
                            <h1> Stock disponibles </h1>
                            <strong className="text-5xl"> {products.reduce((total, producto) => total + producto.stock, 0)} </strong>
                        </div>
                    </div> 
                </div>
            </section>
            {
                ["user", "manager"].includes(Session.role) ?
                <></>
                :
                <section className="mt-10 ">
                    <div className="flex items-center gap-3 pb-4">
                        <h1 className="text-2xl font-bold"> Usuarios </h1>
                        <Link href="/users" className="underline underline-offset-2">
                            ver usuarios
                        </Link>
                    </div>
                    <div className="grid grid-cols-4 gap-3 h-48">
                        <div className="bg-white p-4 rounded-2xl border border-black/10 text-center flex">
                            <div className="m-auto">
                                <h1> Usuarios registrados </h1>
                                <strong className="text-5xl"> {users.length} </strong>
                            </div>
                        </div>  

                        <div className="bg-white p-4 rounded-2xl border border-black/10 text-center flex">
                            <div className="m-auto">
                                <h1> Administradores </h1>
                                <strong className="text-5xl"> {obtenerPorcentajePorRol(users, "admin")} % </strong>
                            </div>
                        </div>  

                        <div className="bg-white p-4 rounded-2xl border border-black/10 text-center flex">
                            <div className="m-auto">
                                <h1> Gestionadores </h1>
                                <strong className="text-5xl"> {obtenerPorcentajePorRol(users, "manager")} % </strong>
                            </div>
                        </div>  
                        
                        <div className="bg-white p-4 rounded-2xl border border-black/10 text-center flex">
                            <div className="m-auto">
                                <h1> Usuarios </h1>
                                <strong className="text-5xl"> {obtenerPorcentajePorRol(users, "user")} % </strong>
                            </div>
                        </div>  
                        
                    </div>
                </section>
            }
        </main>
    )
}

function obtenerPorcentajePorRol(usuarios: Usuario[], rolEspecifico: string) {
    const usuariosConRolEspecifico = usuarios.filter((usuario) => usuario.role === rolEspecifico);
  const totalUsuarios = usuarios.length;

    if (totalUsuarios === 0) {
        return '0.00'; // En caso de que no haya usuarios, el porcentaje es 0.00.
    }

    const porcentaje = ((usuariosConRolEspecifico.length / totalUsuarios) * 100).toFixed(2);
    return porcentaje;
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
    Bar,
    Doughnut,
    Line
} from 'react-chartjs-2';

const PieComp = ({
    Rows
}: {Rows: Producto[]}) => {
    ChartJS.register(ArcElement, Title, Tooltip, Legend);

    const modelos = Rows.map(producto => producto.modelo);
    const stocks = Rows.map(producto => producto.stock);

    const generateRandomColors = (numColors: number) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            const hue = (i * 360) / numColors;
            colors.push(`hsl(${hue}, 70%, 50%)`);
        }
        return colors
    };
      

    const backgroundColor = generateRandomColors(modelos.length);

    const data = {
        labels: modelos,
        datasets: [
          {
            label: 'Stock por modelo',
            data: stocks,
            backgroundColor: backgroundColor,
            borderWidth: 2,
          },
        ],
      };
    
    return <Doughnut className="w-full h-full" options={{
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: "Modelo de productos por stock"
            },
            legend: {
                display: false
            }
        }
    }} data={data} />;
}

const AreaChart = ({
    Rows
}: {Rows: Producto[]}) => {
    ChartJS.register(ArcElement, Title, Tooltip, Legend);

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

    const stockByModel: Record<string, number> = {};

    Rows.forEach((producto) => {
        const { modelo, stock } = producto;

        if (!stockByModel[modelo]) {
        stockByModel[modelo] = 0;
        }

        stockByModel[modelo] += stock;
    });

    const labels = Object.keys(stockByModel);
    const stockValues = labels.map((modelo) => stockByModel[modelo]);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Cantidad de Productos por Modelo',
                data: stockValues,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
            position: 'right' as const,
          },
          title: {
            display: true,
            text: 'Stock de producto por modelo',
          },
        },
      };

    return <Line className="w-full h-full" options={options} data={data} />;
}

  