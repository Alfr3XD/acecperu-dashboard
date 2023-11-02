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
import { Auditoria, Usuario } from '@prisma/client';
import { createAuditoria } from '@Controller/auditoria/api';

export default function AddUser() {
    const [error, setError] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState<{id: number | undefined, name: string, password: string}>({
        id: undefined,
        name: "",
        password: "",
    });
    
    const [formSelectValue, setFormSelectValue] = useState<Selection>(new Set([]))
    const router = useRouter();
    const { data: session } = useSession();
    const Session = (session?.user as Usuario);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const body = {
            ...formValues,
            role: String(Array.from(formSelectValue)[0])
        }

        if(formValues.id) {
            body.id = Number(formValues.id)
        }

        setLoading(true)
        await fetch('/api/db/usuario/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then(async (res) => {
            const data = await res.json()
            if(res.ok) {
                await createAuditoria({
                    user_id: Number(Session.id),
                    table: {
                        title: "Usuarios",
                        content: `Creó a un nuevo usuario con Id: ${data.user.name.id} - ${data.user.name.name}`,
                    },
                    operation: "INSERT"
                })
                console.log("Usuario creado");
                router.push("/users")
            } else {
                setLoading(false);
                setError(true);
            }
        })
        .catch((err) => {
            setError(true);
            setLoading(false);
        })
    };
    
    const rolesValidation = ["system"];

    const SelectionRole = [
        {value: "manager", label: "Gestionador"},
        {value: "user", label: "Usuario"}
    ]

    if(rolesValidation.includes(((session?.user as {role: string}).role))) {
        SelectionRole.push({value: "admin", label: "Administrador"})
    }

    const Forms = [
        {
            uid: "id",
            name: "ID de usuario (opcional)",
            placeholder: "Asignar Id",
            isRequerid: false,
            size: "fit",
            maxLength: 20,
            type: "number"
        },
        {
            uid: "name",
            name: "Nombre del usuario",
            placeholder: "Nombre",
            isRequerid: true,
            maxLength: 16,
            size: "fit",
        },
        {
            uid: "password",
            name: "Contraseña",
            placeholder: "Contraseña",
            isRequerid: true,
            type: "password",
            maxLength: 16,
            size: "fit",
        },
        {
            uid: "role",
            name: "Rol asignado",
            placeholder: "Asignar Rol",
            isRequerid: true,
            isSelect: true,
            selectOptions: SelectionRole,
        }
    ];

    const filterUnwantedCharacters = (value: string) => {
        const regex = /^[a-zA-Z0-9]+$/;
        return value.split('').filter((char) => regex.test(char)).join('').toLowerCase();
    };

    return (
        <main className="max-w-7xl h-full container mx-auto p-4">
            <div className=''>
                <h1 className="text-4xl font-bold mb-2"> Crea un usuario </h1>
                <p className='opacity-80'> Rellena los campos según indica. </p> 
                <p className='opacity-80'> Tenga cuidado al rellenar los campos, no use espaciados. </p>
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
                                    placeholder={atributo.placeholder}
                                    className={`max-w-md`}
                                    onSelectionChange={setFormSelectValue}
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
                            placeholder={atributo.placeholder}
                            label={atributo.name}
                            content={atributo.uid}
                            onValueChange={(value) => {
                                setFormValues({ ...formValues, [atributo.uid]: atributo.type === "password" ? value : filterUnwantedCharacters(value) })
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