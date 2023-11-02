import Link from 'next/link';
import { Dispatch, FC, Fragment, ReactNode, SetStateAction } from 'react';

import { usePathname } from 'next/navigation';

import {
    BiSolidDashboard
} from 'react-icons/bi';

import {
    MdOutlineMenu,
    MdClose
} from 'react-icons/md';

type HeaderProps = {
    children: React.ReactNode;
    navState: [boolean, Dispatch<SetStateAction<boolean>>]
}
export const Header: FC<HeaderProps> = ({children, navState}) => {
    const path = usePathname().split("/").slice(1);
    const [navShow, setShow] = navState;
    
    return (
        <>
        <div className='w-full min-h-screen h-auto flex flex-col gap-4 justify-between overflow-x-clip'>
            <header className="w-full bg-[#962222] px-4 py-6 flex flex-col justify-center items-center gap-5 text-white">
                <div className='flex gap-4 items-start justify-between'>
                    <button 
                        onClick={() => setShow(!navShow)}
                        className='lg:hidden p-3'
                    >
                        {navShow ? <MdClose /> : <MdOutlineMenu />}
                    </button>

                    <div className='flex flex-col items-center gap-3'>
                        <h1 className='text-4xl font-semibold text-center uppercase'>  DASHBOARD </h1>
                        <div className='flex gap-1 items-center p-3 bg-white/20 rounded-lg w-fit'>
                            <Link 
                                href="/dashboard"
                                className='transition-all flex gap-1 items-center hover:text-red-300'
                            >
                                <BiSolidDashboard className="w-5 h-5"/>
                                <span> Dashboard </span>
                            </Link>
                            <span> / </span>
                            {path.map((path, i) => path === "dashboard" ?<></> :
                                <Fragment key={i}>
                                    <Link 
                                        href={"/"+path}
                                        className='transition-all flex gap-1 items-cente hover:text-red-300 capitalize'
                                    >
                                        <span> {path} </span>
                                    </Link>
                                    <span> / </span>
                                </Fragment>
                            )}
                        </div>
                    </div>
                </div>
            </header>

                {children}


            <footer className='bg-zinc-700 p-4 text-white text-sm text-center'>
                <span> © Acecperu Dashboard 2023 | Todos los derechos reservados </span>
            </footer>
        </div>
        </>
    )
}