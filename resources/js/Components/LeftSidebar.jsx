import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

// Import ikon yang dibutuhkan
import {
    HomeIcon,
    UserGroupIcon,
    UserCircleIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    EllipsisHorizontalIcon,
    ArrowLeftOnRectangleIcon,
    UserPlusIcon, // <-- 1. Tambahkan ikon baru (outline)
} from '@heroicons/react/24/outline';

import {
    HomeIcon as HomeIconSolid,
    UserGroupIcon as UserGroupIconSolid,
    UserCircleIcon as UserCircleIconSolid,
    UserPlusIcon as UserPlusIconSolid, // <-- 1. Tambahkan ikon baru (solid)
} from '@heroicons/react/24/solid';

const CompanyLogo = () => (
    <span className="flex items-center justify-center h-8 w-8 text-black rounded-full font-bold text-lg xl:ml-3">Hane</span>
);

export default function LeftSidebar({ auth, isMobileMenuOpen, setIsMobileMenuOpen }) {
    const { url } = usePage();
    const user = auth.user;

    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    // ===================================================================
    // ====> PERUBAHAN UTAMA: Tambahkan item "Pertemanan" ke navigasi <====
    // ===================================================================
    const navItems = [
        { href: '/dashboard', label: 'Dashboard', activeIcon: HomeIconSolid, inactiveIcon: HomeIcon },
        { href: '/groups', label: 'Grup', activeIcon: UserGroupIconSolid, inactiveIcon: UserGroupIcon },
        { href: '/friendships', label: 'Pertemanan', activeIcon: UserPlusIconSolid, inactiveIcon: UserPlusIcon }, // <-- 2. Tambahkan item baru
        { href: '/search', label: 'Search', activeIcon: MagnifyingGlassIcon, inactiveIcon: MagnifyingGlassIcon },
        { href: '/profile', label: 'Profil', activeIcon: UserCircleIconSolid, inactiveIcon: UserCircleIcon },
    ];
    // ===================================================================
    // ===================================================================

    const handleLogout = (e) => { e.preventDefault(); router.post('/logout'); };

    return (
        <>
            {isMobileMenuOpen && (
                <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black/60 z-30 lg:hidden"
                    aria-hidden="true"
                ></div>
            )}

            <header className={`
                fixed inset-y-0 left-0 bg-light-bg z-40
                w-24
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                
                lg:translate-x-0 lg:w-24 xl:w-80
                
                flex flex-col justify-between h-screen p-3 border-r border-stone-200
            `}>
                <div>
                    <div className="flex items-center justify-center xl:justify-start mb-4">
                        <Link href="/dashboard" className="inline-block p-2 rounded-full hover:bg-stone-100 transition-colors">
                            <CompanyLogo />
                        </Link>
                    </div>

                    <nav>
                        <ul>
                            {navItems.map((item) => {
                                const isActive = url.startsWith(item.href);
                                const Icon = isActive ? item.activeIcon : item.inactiveIcon;
                                return (
                                    <li key={item.label}>
                                        <Link href={item.href} className={`flex items-center justify-center xl:justify-start gap-4 text-lg group w-full p-3 rounded-full transition-colors duration-200 ${isActive ? 'text-stone-900' : 'text-stone-600'} hover:bg-stone-100`}>
                                            <Icon className="h-7 w-7" />
                                            <span className={`hidden xl:block ${isActive ? 'font-bold' : 'font-normal'}`}>{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    <div className="mt-6 pr-0 xl:pr-4">
                        <Link
                            href="/posts/create"
                            className="w-full h-[52px] flex items-center justify-center bg-blue-600 text-white font-bold text-lg rounded-full hover:bg-blue-700 transition-all shadow hover:shadow-lg"
                        >
                            <span className="hidden xl:block">Buat Post</span>
                            <PlusIcon className="block xl:hidden h-7 w-7" />
                        </Link>
                    </div>
                </div>

                <div className="relative mt-4">
                    {showLogoutPopup && (
                        <div className="absolute bottom-full mb-2 w-56 -right-20 lg:-right-16 xl:right-0 bg-white border border-stone-200 shadow-lg rounded-xl overflow-hidden">
                            <button type="button" onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-4 py-3 font-bold text-red-600 hover:bg-stone-100">
                                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                                <span>Log out</span>
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-center xl:justify-start gap-1 p-2 rounded-full hover:bg-stone-100 cursor-pointer transition-colors duration-200">
                        <Link href="/profile" className="flex items-center justify-center xl:justify-start gap-3 flex-grow">
                            {auth.user.avatar ? (
                                <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={`/storage/${auth.user.avatar}`}
                                    alt={auth.user.name}
                                />
                            ) : (
                                <div className="h-10 w-10 rounded-full bg-stone-200 flex items-center justify-center">
                                    <svg className="h-6 w-6 text-stone-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
                                    </svg>
                                </div>
                            )}

                            <div className="hidden xl:block">
                                <p className="font-bold text-sm whitespace-nowrap text-stone-900">{auth.user.name}</p>
                                <p className="text-sm text-stone-500 truncate">@{auth.user.username || auth.user.email}</p>
                            </div>
                        </Link>
                        <button type="button" onClick={() => setShowLogoutPopup(!showLogoutPopup)} className="p-2 rounded-full flex-shrink-0 hidden xl:block">
                            <EllipsisHorizontalIcon className="h-5 w-5 text-stone-600" />
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
}