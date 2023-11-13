'use client';
import {
    useState,
    useEffect,
    ChangeEvent
} from 'react';
import {
    Button,
    Input,
    Select,
    SelectItem,
    Selection,
    Spinner
} from "@nextui-org/react";
import { Form } from '@Components/inputs/form.component';
import {
    BiPlus
} from 'react-icons/bi';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Producto, Usuario } from '@prisma/client';
import { ProductoModel } from '@Controller/getColums';
import { createAuditoria } from '@Controller/auditoria/api';


export default function AddProduct() {
    const [error, setError] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        id: 0 || undefined,
        serie: 0,
        modelo: "",
        description: "",
        frequency: 0,
        velocidad: 0,
        poder: 0,
        voltage: 0,
        stock: 0,
        precio_u: 0.00,
    });
    
    const [formSelectValue, setFormSelectValue] = useState<Selection>(new Set([]))
    const router = useRouter();

    const { data: session } = useSession();
    const Session = (session?.user as Usuario);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const body = {
            props: {
                ...formValues,
                frequency: Number(Array.from(formSelectValue)[0])
            },
        }
        setLoading(true)
        await fetch('/api/db/producto/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then(async (res) => {
            if(res.ok) {
                const data  = (await res.json() as {data: Producto});
                await createAuditoria({
                    user_id: Number(Session.id),
                    table: {
                        title: "Inventario",
                        content: `Se añadió el producto con modelo: ${data.data.modelo} - ${data.data.description} (${data.data.serie})`,
                    },
                    operation: "INSERT"
                })
                console.log("Producto creado");
                router.push("/products")
            } else {
                setLoading(false);
                setError(true);
            }
        })
        .catch((err) => {
            setError(true);
            setLoading(false);
            console.log(err)
        })
    }

    const adminroleValidation = ["system"];

    const SelectionRole = [
        {value: "manager", label: "Gestionador"},
        {value: "user", label: "Usuario"}
    ]

    if(adminroleValidation.includes(((session?.user as {role: string}).role))) {
        SelectionRole.push({value: "admin", label: "Administrador"})
    }

    const Forms = ProductoModel.map((x) => x.uid === "frequency" ? 
    ({
        uid: x.uid,
        name: x.name + `${x.required ? "" : " (opcional)"}`,
        isRequerid: x.required,
        isSelect: true,
        selectOptions: [
            {value: 60, label: "60 Hz"},
            {value: 50, label: "50 Hz"}
        ],

    })
    : ({
        uid: x.uid,
        name: x.name + `${x.required ? "" : " (opcional)"}`,
        isRequerid: x.required,
        size: "fit",
        maxLength: 999,
        type: x.type === "String" || x.type === "DateTime" ? "text" : "number"
    }));

    const validationRoles = ["system", "admin", "manager"];
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

    return (
        <main className="max-w-7xl h-full container mx-auto p-4">
            <div className=''>
                <h1 className="text-4xl font-bold mb-2"> Añade un producto </h1>
                <p className='opacity-80'> Rellena los campos según indica. </p> 
            </div>
            

            <form autoComplete="off" onSubmit={onSubmit}>
                <div className="flex flex-wrap items-end gap-4 mt-10">
                    {Forms?.map((atributo, i) => {
                        
                        if(atributo.isSelect) {
                            return (
                                <Select 
                                    key={i}
                                    size="lg"
                                    radius='sm'
                                    color='default'
                                    variant='bordered'
                                    label={atributo.name}
                                    className={`max-w-md`}
                                    onSelectionChange={setFormSelectValue}
                                    selectedKeys={formSelectValue}
                                    isRequired={atributo.isRequerid}
                                    isInvalid={error}
                                >
                                    {atributo.selectOptions.map((opt, i) => 
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    )}
                                </Select>
                            )
                        } 

                        return <Input
                            key={i}
                            type={atributo.type ?? "text"}
                            {...atributo.type ? {min:"0"} : {}}
                            classNames={{
                                inputWrapper: "bg-white rounded-lg"
                            }}
                            size='lg'
                            radius='lg'
                            variant='bordered'
                            className={`max-w-${atributo.size ? atributo.size : "lg"}`}
                            label={atributo.name}
                            content={atributo.uid}
                            onValueChange={(value) => {
                                setFormValues({ ...formValues, [atributo.uid]: atributo.type === "number" ? Number(value) : value })
                            }}
                            isRequired={atributo.isRequerid}
                            isInvalid={error}
                            maxLength={atributo.maxLength}
                        />
                        
                    })}
                </div>
                <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white mt-10"
                    isLoading={isLoading}
                >
                    {isLoading ?
                        <>
                            <span> Cargando </span>
                        </> :
                        <>
                            <BiPlus />
                            <span> SUBMIT </span>
                        </>
                    }
                </Button>
            </form>
        </main>
    );
}