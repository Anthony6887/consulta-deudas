'use client';

import Image from 'next/image';
import {
    MdAccountBalance,
    MdSearch,
    MdHelpOutline,
    MdMenu,
} from 'react-icons/md';

type Props = {
    open: boolean;
    onToggle: () => void;
};

export default function Sidebar({ open, onToggle }: Props) {
    return (
        <>
            {/* OVERLAY MOBILE */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={onToggle}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`fixed left-0 top-0 z-50 h-full w-64 transform bg-blue-800 text-white transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0`}
            >
                {/* LOGO */}
                <div className="flex flex-col items-center gap-2 p-6 border-b border-blue-700">
                    <Image
                        src="/pelileo.png"
                        alt="GAD Municipal"
                        width={70}
                        height={70}
                        priority
                    />
                    <span className="text-sm font-semibold text-center">
                        GAD Municipal
                    </span>
                </div>

                {/* MENÚ */}
                <nav className="mt-6 space-y-2 px-4">
                    <MenuItem icon={<MdSearch size={22} />} label="Consulta de Deudas" />
                    <MenuItem icon={<MdHelpOutline size={22} />} label="Ayuda" />
                </nav>
            </aside>

            {/* BOTÓN MOBILE */}
            <button
                onClick={onToggle}
                className="fixed left-4 top-4 z-50 rounded-lg bg-blue-700 p-2 text-white shadow-md md:hidden"
            >
                <MdMenu size={26} />
            </button>
        </>
    );
}

function MenuItem({
    icon,
    label,
}: {
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <div className="flex cursor-pointer items-center gap-3 rounded-lg p-3 text-sm hover:bg-blue-700">
            {icon}
            <span>{label}</span>
        </div>
    );
}
