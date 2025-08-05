import React, { useState } from 'react';
import { router, usePage, Link } from '@inertiajs/react';
import { MagnifyingGlassIcon, UserGroupIcon } from '@heroicons/react/24/outline';

// Komponen kecil yang dapat digunakan kembali untuk setiap item grup
function GroupItem({ group }) {
    return (
        <Link
            key={group.id}
            href={`/groups/${group.id}`}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white transition-colors duration-200"
        >
            <div className="flex-shrink-0 bg-stone-200 p-2 rounded-full">
                <UserGroupIcon className="h-6 w-6 text-stone-600" />
            </div>
            <div>
                <p className="font-bold text-stone-800">{group.name}</p>
                <p className="text-sm text-stone-500">{group.users_count ?? 0} anggota</p>
            </div>
        </Link>
    );
}


export default function RightSidebar() {
    // Mengambil DUA daftar grup yang berbeda dari backend
    const { recommendedGroups = [], myGroups = [] } = usePage().props;
    const [keyword, setKeyword] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            router.get('/search', { keyword }, { preserveState: true });
        }
    };

    return (
        <aside className="h-screen w-[400px] pl-8 pr-4 py-2 hidden xl:block bg-light-bg">
            <div className="space-y-6 sticky top-2">
                
                {/* 1. Bagian Pencarian (tetap sama) */}
                <div className="bg-stone-100 border border-stone-200 rounded-2xl p-4">
                    <h2 className="font-bold text-xl mb-3 text-stone-800">Pencarian</h2>
                    <form onSubmit={handleSearch} className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-stone-500" />
                        </div>
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Ketik untuk mencari..."
                            className="w-full bg-white text-stone-800 border-stone-300 rounded-full pl-12 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </form>
                </div>

                {/* 2. Widget Baru: Grup Saya */}
                <div className="bg-stone-100 border border-stone-200 rounded-2xl p-2">
                    <h2 className="font-bold text-xl mb-1 text-stone-800 px-2 pt-2">Grup Saya</h2>
                    <div className="space-y-1">
                        {myGroups.length > 0 ? (
                            myGroups.map((group) => <GroupItem key={group.id} group={group} />)
                        ) : (
                            <p className="p-3 text-sm text-stone-500">Anda belum bergabung dengan grup manapun.</p>
                        )}
                    </div>
                </div>

                {/* 3. Widget Rekomendasi Grup */}
                <div className="bg-stone-100 border border-stone-200 rounded-2xl p-2">
                    <h2 className="font-bold text-xl mb-1 text-stone-800 px-2 pt-2">Rekomendasi Grup</h2>
                    <div className="space-y-1">
                        {recommendedGroups.length > 0 ? (
                            recommendedGroups.map((group) => <GroupItem key={group.id} group={group} />)
                        ) : (
                            <p className="p-3 text-sm text-stone-500">Tidak ada rekomendasi grup saat ini.</p>
                        )}
                        <Link href="/groups" className="block w-full text-left p-3 text-sm text-blue-600 hover:bg-white rounded-xl font-semibold transition-colors">
                            Lihat Semua Grup
                        </Link>
                    </div>
                </div>

            </div>
        </aside>
    );
}