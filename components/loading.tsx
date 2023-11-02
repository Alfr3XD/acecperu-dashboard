'use client';
import { Icon } from '@iconify/react';
import blocksScale from '@iconify/icons-svg-spinners/blocks-scale';
import {
    Transition
} from '@headlessui/react';

export default function Loading({loaded}: {loaded: boolean}) {
    return (
        <Transition
            className="fixed w-full h-full z-[999] bg-white"
            show={loaded}
            enter="transition-all duration-300"
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave="transition-all duration-300 delay-1000"
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
        >
            <div className="flex h-full">
                <div className="m-auto">
                    <Icon className='w-20 h-20' icon={blocksScale} />
                    <span> Cargando... </span>
                </div>
            </div>
        </Transition>
    )
}