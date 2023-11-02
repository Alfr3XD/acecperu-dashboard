'use client';
import {useState, useEffect} from 'react'
import { useSession } from "next-auth/react";
import { Header } from "@Components/header.component";
import { Sidebar } from "@Components/navigation/sidebar.component";
import { useRouter } from 'next/navigation';
import Loading from '@Components/loading';
import { MagicMotion } from "react-magic-motion";

export default function Template({children}: {
    children: React.ReactNode
}) {
    const [page, setPage] = useState(false);
    const navState = useState(false);
    const router = useRouter();
    const {status} = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            void router.push("/");
        } else {
            setPage(true)
        }
    }, [status, router]);

    return (
        <>
        <Loading loaded={!page} /> 

        {page ? (
            <div className="bg-neutral-100 lg:flex h-full w-full">
                <Sidebar navState={navState} />
                <Header navState={navState} >
                    {children}
                </Header>
            </div>
            ) : 
            <></>
        }
        </>
    )

}