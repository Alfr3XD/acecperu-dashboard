'use client';
import { useEffect, useState } from "react";
import TableComponent from '@Components/content/Table';
import { useSession } from "next-auth/react";
import { Producto, Usuario } from "@prisma/client";
import { ProductoModel } from "@Controller/getColums";

export default function ProductsPage() {
    const [Columns, setColumns] = useState<string[]>(ProductoModel.map((x) => x.uid));
    const [Rows, setRows] = useState<Producto[] | []>([]);
    const [isLoading, setLoading] = useState(true);
    const [selectedRows, setSelectAllChecked] = useState<Producto[]>();

    const {data: session} = useSession();
    const Session = (session?.user as Usuario);

    const Get = async() => {
        setLoading(false)

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
                setRows(content)
                setLoading(false);
            } 
        }
        catch(error) {
            setRows([])
        }
    }

    const Delete = async(id: number) => {
        try {
            const res = await fetch('/api/db/producto/delete', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: id})
            })
            const data = (await res.json() as {data: Producto});
            if(res.ok) {
                await createAuditoria({
                    user_id: Number(Session.id),
                    table: {
                        title: "Inventario",
                        content: `eliminó el producto con de modelo: ${data.data.modelo} - ${data.data.description} (${data.data.serie})`,
                    },
                    operation: "DELETE"
                })
                Get();
            } else {
                console.log(data);
            }
        }
        catch(error) {
            console.log(error)
            return;
        }
    }

    
    async function DeleteProducts() {
        if(selectedRows) {
            for (const row of selectedRows) {
                Delete(row.id)
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
                case "serie":
                    return {
                        uid: item,
                        name: "N° DE SERIE",
                        sortable: true
                    }
                case "modelo":
                    return {
                        uid: item,
                        name: "MODELO DE PRODUCTO",
                        sortable: true
                    }
                case "description":
                    return {
                        uid: item,
                        name: "DESCRIPCIÓN DEL PRODUCTO",
                    }
                case "frequency":
                    return {
                        uid: item,
                        name: "FRECUENCIA",
                        sortable: true
                    }
                case "velocidad":
                    return {
                        uid: item,
                        name: "VELOCIDAD MÁXIMA",
                        sortable: true
                    }
                case "poder":
                    return {
                        uid: item,
                        name: "PODER MÁXIMO",
                        sortable: true
                    }
                case "createdTimestamp":
                    return {
                        uid: item,
                        name: "FECHA DE ASIGNACIÓN",
                        sortable: true
                    }
                case "stock":
                    return {
                        uid: item,
                        name: "CANTIDAD",
                        sortable: true
                    }
                case "precio_u":
                    return {
                        uid: item,
                        name: "PRECIO UNITARIO",
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
        serie: (value: string) => <span> {value}SP series </span>,
        frequency: (value: string) => <span> {value} Hz </span>,
        poder: (value: string) => <span> {value} hp </span>,
        speed: (value: string) => <span> {value} rpm </span>,
        createdTimestamp: (value: string) => <span> {value} </span>,
        precio_u: (value: string) => <span> S/ {value} </span>
    };

    useEffect(() => {
        Get();
    }, [])
    
    return (
        <>
            <main className="max-w-screen-2xl h-full container mx-auto p-4">
                <div className="flex flex-col gap-2 mb-4">
                    <h1 className="text-4xl font-semibold"> Productos </h1>
                    <p className="opacity-60"> Gestiona los productos de AcecPerú </p>
                </div>
                <div className="flex flex-col gap-5"></div>
                {!isLoading ?
                    <>
                    <div className="w-full">
                        <TableComponent
                            columns={HeadContent()}
                            data={Rows}
                            serchColumnFilter="modelo"
                            selectedColumnsKey={setSelectAllChecked}
                            emptyBody="No se contró contenido"
                            searchPlaceholder="Buscar a producto por modelo..."
                            keyTarget="id"
                            isLoading={isLoading}
                            customCellsRender={customCellsRender}
                            callbackAddButton="products/add"
                            callbackDeleteButton={DeleteProducts}
                            callbackDeleteButtonColumn={Delete}
                            callbackEditButton={(x) => `products/${x.id}`}
                            isStatic={Session.role === "user" ? true : false}
                        />
                    </div>
                    <div className="grid grid-cols-5 gap-4 mt-10">
                        <div className="col-span-5 lg:col-span-1 bg-white rounded-3xl p-4 border border-black/10">
                            <PieComp Rows={Rows} />
                        </div>
                        <div className="col-span-5 lg:col-span-2 bg-white rounded-3xl p-4 border border-black/10">
                            <AreaChart Rows={Rows}/>
                        </div>
                        <div className="col-span-5 lg:col-span-2 bg-white rounded-3xl p-4 border border-black/10">
                            <BarChart Rows={Rows}/>
                        </div>
                        
                    </div>
                    </>
                    :
                    <></>
                }
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
    Bar,
    Doughnut,
    Line
} from 'react-chartjs-2';
import { createAuditoria } from "@Controller/auditoria/api";

const AreaChart = ({
    Rows
}: {Rows: Producto[]}) => {
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
      
    const stockByYearMonth: Record<string, number> = {};

    Rows.forEach((producto) => {
        const { createdTimestamp, stock } = producto;
        const date = new Date(createdTimestamp);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Sumar 1 para que enero sea 1 en lugar de 0
        const yearMonthKey = `${year}-${month}`;

        if (!stockByYearMonth[yearMonthKey]) {
            stockByYearMonth[yearMonthKey] = 0;
        }

        stockByYearMonth[yearMonthKey] += stock;
    });

    const labels = Object.keys(stockByYearMonth);
    const sortedLabels = labels.sort((a, b) => {
        const [yearA, monthA] = a.split('-').map(Number);
        const [yearB, monthB] = b.split('-').map(Number);
        return new Date(yearA, monthA - 1) as any - (new Date(yearB, monthB - 1) as any);
    });

    // Crear un array de nombres de meses
    const monthNames = new Array(12).fill(0).map((_, index) => {
        const date = new Date(2000, index, 1); // Utiliza un año constante (por ejemplo, 2000)
        return date.toLocaleString('default', { month: 'long' });
    });

    // Reemplazar las etiquetas numéricas con los nombres de los meses
    const labelsWithMonthNames = sortedLabels.map((label) => {
        const [, month] = label.split('-').map(Number);
        return `${monthNames[month - 1]}-${label.split('-')[0]}`;
    });

    const stockValues = sortedLabels.map((key) => stockByYearMonth[key]);

    const data = {
        labels: labelsWithMonthNames,
        datasets: [
            {
                fill: true,
                label: 'Stock por Año y Mes',
                data: stockValues,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Stock de productos por Año y Mes',
            },
            legend: {
                display: false
            }
        },
        maintainAspectRatio: false,
    };

    return <Line className="w-full h-full" options={options} data={data} />;
}

const BarChart = ({
    Rows
}: {Rows: Producto[]}) => {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
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

    const labelsWithStock = labels.map((modelo, index) => ({ modelo, stock: stockValues[index] }));

    // Ordenar el array de objetos por el campo 'stock' de forma descendente
    labelsWithStock.sort((a, b) => b.stock - a.stock);

    // Obtener los arrays ordenados
    const sortedLabels = labelsWithStock.map(item => item.modelo);
    const sortedStockValues = labelsWithStock.map(item => item.stock);

    const data = {
        labels: sortedLabels,
        datasets: [
            {
                label: 'Cantidad de Productos por Modelo',
                data: sortedStockValues,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    const options = {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
            position: 'right' as const,
          },
          title: {
            display: true,
            text: 'Cantidad de productos por modelo',
          },
        },
      };

    return <Bar className="w-full h-full" options={options} data={data} />;

}

const PieComp = ({
    Rows
}: {Rows: Producto[]}) => {
    ChartJS.register(ArcElement, Tooltip, Legend);

    const stock50 = Rows.filter(producto => producto.frequency === 50).length;
  const stock60 = Rows.filter(producto => producto.frequency === 60).length;

  const data = {
    labels: ['50 Hz', '60 Hz'],
    datasets: [
      {
        data: [stock50, stock60],
        backgroundColor: ['rgba(49, 73, 135, 0.8)', 'rgba(57, 145, 225, 0.8)'],
      },
    ],
  };

  return <Doughnut className="w-full h-full" options={{
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Recuento de productos por frecuencia",
      },
      legend: {
        position: "bottom",
      },
    },
  }} data={data} />;
}