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


export default function UpdateProductContent({product}: {product: Producto}) {
    const [error, setError] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        serie: product.serie,
        modelo: product.modelo,
        description: product.description,
        frequency: product.frequency,
        velocidad: product.velocidad,
        poder: product.poder,
        voltage: product.voltage,
        stock: product.stock,
        precio_u: product.precio_u,
    });
    
    const [formSelectValue, setFormSelectValue] = useState<Selection>(new Set([]))
    const router = useRouter();

    const { data: session } = useSession();
    const Session = (session?.user as Usuario);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const body = {
            id: product.id,
            data: formValues,
        }

        if(String(Array.from(formSelectValue)[0]) !== "undefined") {
            body.data.frequency = Number(Array.from(formSelectValue)[0])
        }

        setLoading(true)
        await fetch('/api/db/producto/edit', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then(async (res) => {
            const data  = (await res.json() as {data: Producto});
            if(res.ok) {
                await createAuditoria({
                    user_id: Number(Session.id),
                    table: {
                        title: "Inventario",
                        content: `Se actualizó el producto con modelo: ${data.data.modelo} - ${data.data.description} (${data.data.serie})`,
                    },
                    operation: "UPDATE"
                })
                console.log("Producto edito");
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

    const rolesValidation = ["system"];

    const SelectionRole = [
        {value: "manager", label: "Gestionador"},
        {value: "user", label: "Usuario"}
    ]

    if(rolesValidation.includes(((session?.user as {role: string}).role))) {
        SelectionRole.push({value: "admin", label: "Administrador"})
    }

    const Forms = ProductoModel.filter(x => x.uid !== "id" ).map((x) => x.uid === "frequency" ? 
    ({
        uid: x.uid,
        name: x.name + `${x.required ? "" : " (opcional)"}`,
        isRequerid: x.required,
        isSelect: true,
        value: formValues[x.uid as keyof typeof formValues],
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
        type: x.type === "String" || x.type === "DateTime" ? "text" : "number",
        value: formValues[x.uid as keyof typeof formValues]
    }));

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
                                    radius='sm'
                                    color='default'
                                    variant='bordered'
                                    label={atributo.name}
                                    className={`max-w-md`}
                                    onSelectionChange={setFormSelectValue}
                                    isRequired={atributo.isRequerid}
                                    isInvalid={error}
                                    defaultSelectedKeys={[atributo.value]}
                                    defaultValue={atributo.value}
                                >
                                    {atributo.selectOptions.map((opt) => {
                                        return (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                        )
                                    })}
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
                            defaultValue={String(atributo.value)}
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