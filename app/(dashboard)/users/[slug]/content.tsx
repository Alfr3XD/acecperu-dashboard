'use client';
import {
    useState,
} from 'react';
import { useSession } from "next-auth/react";
import {
    Button,
    Input,
    Select,
    SelectItem,
    Selection,
} from "@nextui-org/react";

import { MdEdit } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { hash } from 'bcryptjs';
import { isUndefined } from 'lodash';
import { Usuario } from '@prisma/client';
import { createAuditoria } from '@Controller/auditoria/api';

export default function EditUser({user}: {user: any}) {
    const [error, setError] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        id: user.id,
        name: user.name,
        password: user.password,
        role: user.role
    });
    
    const [formSelectValue, setFormSelectValue] = useState<Selection>(new Set([]))
    const router = useRouter();

    const { data: session } = useSession();
    const Session = (session?.user as Usuario);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const body = {
            ...formValues,
        }
        if(body.password || !isUndefined(body.password)) {
            const hashed_password = await hash(body.password, 12);
            body.password = hashed_password;
        }

        if(String(Array.from(formSelectValue)[0]) !== "undefined") {
            body.role = String(Array.from(formSelectValue)[0])
        }

        try {
            setLoading(true)
            const res = await fetch('/api/db/usuario/edit', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            const data = await res.json()

            if(res.ok) {
                await createAuditoria({
                    user_id: Number(Session.id),
                    table: {
                        title: "Usuarios",
                        content: `Editó al usuario con Id: ${data.user.name.id} - ${data.user.name.name}`,
                    },
                    operation: "UPDATE"
                })       
                router.push("/users")
            } else {
                setLoading(false);
                setError(true);
            }
        } catch (err: any) {
            setError(true);
            setLoading(false);
            console.error(err)
        }
    };

    const rolesValidation = ["system", "admin"]

    if(String((session?.user as {id: string}).id) === String(user.id)) {
        router.push("/me")
        return <></>
    }

    if(!rolesValidation.includes(((session?.user as {role: string}).role)) || (session?.user as {role: string}).role === user.role) {
        return (
            <div className="h-full px-8">
                <h1 className="text-4xl text-center font-bold pt-40">
                    ERROR 401
                </h1>
                <p className='text-center mt-4'> NO TIENES PERMISOS PARA EDITAR A ESTE USUARIO </p>
            </div>
        )
    }

    const SelectionRole = [
        {value: "manager", label: "Gestionador"},
        {value: "user", label: "Usuario"}
    ]

    if(rolesValidation.includes(((session?.user as {role: string}).role))) {
        SelectionRole.push({value: "admin", label: "Administrador"})
    }

    const Forms = [
        {
            uid: "name",
            name: "Nombre del usuario",
            placeholder: user.name,
            value: user.name,
            isRequerid: true,
            maxLength: 16,
        },
        {
            uid: "password",
            name: "Contraseña ",
            placeholder: "Contraseña",
            type: "password",
            maxLength: 16,
        },
        {
            uid: "role",
            name: "Rol asignado",
            placeholder: user.role,
            value: user.role,
            isRequerid: true,
            isSelect: true,
            selected: user.role,
            selectOptions: SelectionRole,
        }
    ];

    const filterUnwantedCharacters = (value: string) => {
        const regex = /^[a-zA-Z0-9]+$/;
        return value.split('').filter((char) => regex.test(char)).join('').toLowerCase();;
    };

    return (
        <main className="max-w-7xl h-full container mx-auto p-4">
            <div >
                <h1 className="text-4xl font-bold mb-4"> Usuario: {user.name} </h1>
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
                                    radius='sm'
                                    color='default'
                                    variant='bordered'
                                    label={atributo.name}
                                    placeholder={atributo.placeholder}
                                    className={`max-w-md`}
                                    onSelectionChange={setFormSelectValue}
                                    isRequired={atributo.isRequerid}
                                    isInvalid={error}
                                    defaultSelectedKeys={[atributo.selected]}
                                    defaultValue={atributo.value}
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
                            type={atributo.type ?? "text"}
                            {...atributo.type ? {min:"0"} : {}}
                            key={i}
                            classNames={{
                                inputWrapper: "bg-white rounded-lg"
                            }}
                            size='lg'
                            radius='lg'
                            variant='bordered'
                            className={`max-w-lg`}
                            defaultValue={atributo.value}
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
                    className="bg-amber-600 hover:bg-amber-700 text-white mt-10"
                    isLoading={isLoading}
                >
                    {isLoading ?
                        <>
                            <span> Cargando </span>
                        </> :
                        <>
                            <MdEdit />
                            <span> SUBMIT </span>
                        </>
                    }
                </Button>
            </form>
        </main>
    );
}