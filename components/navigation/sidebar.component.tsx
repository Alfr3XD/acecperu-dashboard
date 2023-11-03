'use client';
import {
    Transition
} from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import {
    PiUsersFill
} from 'react-icons/pi';
import {
    MdOutlineMenu,
    MdClose,
    MdInventory2
} from 'react-icons/md';
import {
    BiSolidDashboard,
    BiSolidPackage
} from 'react-icons/bi';

import {
    MdCategory
} from 'react-icons/md';

import { Button } from '@material-tailwind/react';

import UserLogo from '@Resources/image/user.png';
import { Dispatch, SetStateAction } from 'react';
import { IoIosPaper } from 'react-icons/io';

export function Sidebar({ navState }: {navState: [boolean, Dispatch<SetStateAction<boolean>>]}) {
    const {data: session} = useSession();

    const Navigation = [
        {
            span: "Dashboard",
            svg: BiSolidDashboard,
            href: "/dashboard"
        },
        
        {
            span: "Productos",
            svg: MdInventory2,
            href: "/products",
        },
    ];

    const rolesValidation = ["system", "admin"];
    if(rolesValidation.includes((session?.user as {role: string}).role)) {
        Navigation.push({
            span: "Usuarios",
            svg: PiUsersFill,
            href: "/users",
        })
        Navigation.push({
            span: "Auditoria",
            svg: IoIosPaper,
            href: "/logs"
        })
    }

    const pathname = usePathname();
    const [navShow, setNavShow] = navState;

    return (
        <>
            <nav className="max-w-xs container min-h-screen hidden lg:block">
                <AsideNavigation Navigation={Navigation} pathname={pathname} session={session} navState={navState} />
            </nav>
            <Transition
                as="nav"
                className={"fixed top-0 bg-black/80 z-[999] block lg:hidden w-full h-full"}
                show={navShow}
                onClick={() => setNavShow(!navShow)}
                enter="transition duration-[400ms]"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="duration-200 transition ease-in-out"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <AsideNavigation Navigation={Navigation} pathname={pathname} session={session} navState={navState} />
            </Transition>
        </>
    )
}

function AsideNavigation({Navigation, session, pathname, navState}: 
    {
        Navigation: any[],
        session: any,
        pathname: any,
        navState: [boolean, Dispatch<SetStateAction<boolean>>]
    }
) {
    const [navShow, setShow] = navState;

    return (
        <aside
            onClick={(e) => e.stopPropagation()}
            className='fixed top-0 left-0 bg-white max-w-[80%] lg:max-w-xs container h-screen w-full flex flex-col gap-2 p-4'
        >
            <div className='flex items-center gap-4 justify-between'>
                <div className="flex items-center justify-center gap-2">
                    <Image 
                        className='w-14 h-14 lg:w-20 lg:h-20'
                        src="/image/logo.png"
                        width={80}
                        height={80}
                        alt="LOGO"
                        draggable={false}
                    />
                    <span className='text-xl lg:text-3xl font-bold'> Dashboard </span>
                </div>
                <button 
                    onClick={() => setShow(!navShow)}
                    className='lg:hidden p-3'
                >
                    {navShow ? <MdClose /> : <MdOutlineMenu />}
                </button>
            </div>

            <hr />

            <ul className='flex flex-col gap-1.5 mt-5'>
                {Navigation.map((nav, i) => 
                    <li key={i}>
                        <div>
                            <Link href={nav.href}>
                                <Button variant="text" className={`w-full p-3 flex gap-2 items-center rounded-lg ${pathname === nav.href ? "bg-red-900/80 text-white": "hover:bg-black/10 hover:pl-4"} font-semibold transition-all text-md capitalize`}>
                                    <nav.svg className="w-7 h-7"/>
                                    <span> {nav.span} </span>
                                </Button>
                            </Link>
                            <div className='w-full h-0.5 bg-black/10'/>
                        </div>
                    </li>
                )}
                <li>
                    <Link href="/me">
                        <Button variant='text' className={`w-full px-3 py-2 flex gap-2 items-center rounded-lg ${pathname === "/config" ? "bg-red-900/80 text-white": "hover:bg-black/10 hover:pl-4"} font-semibold transition-all text-md lowercase`}>
                            <Image
                                alt="user"
                                src={UserLogo}
                                className='rounded-full bg-slate-600 w-8 h-8 border border-black/50'
                                width={200}
                                height={200}
                            />
                            <span> {session?.user?.name} </span>
                        </Button>
                    </Link>
                </li>
            </ul>
        </aside>
    )
}