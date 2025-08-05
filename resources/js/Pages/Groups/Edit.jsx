// src/Pages/Groups/Edit.jsx

import React, { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import LeftSidebar from '@/Components/LeftSidebar';
import RightSidebar from '@/Components/RightSidebar';
import { ArrowLeftIcon, Bars3Icon } from '@heroicons/react/24/solid';

export default function Edit() {
    const { group, auth } = usePage().props;
    
    // --- PERUBAHAN DI SINI ---
    // Tambahkan '_method: 'put'' ke dalam data form.
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put', // <-- TAMBAHKAN BARIS INI (Method Spoofing)
        name: group.name || '',
        description: group.description || '',
    });
    // --- AKHIR PERUBAHAN ---

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // --- PERUBAHAN DI SINI ---
        // Gunakan metode 'post' untuk mengirim form. Laravel akan
        // melihat field '_method' dan mengarahkannya ke Route::put.
        post(`/groups/${group.id}`, {
            // Opsi ini memastikan scroll tetap di posisi yang sama setelah redirect,
            // sangat berguna untuk melihat pesan error tanpa perlu scroll.
            preserveScroll: true, 
        });
        // --- AKHIR PERUBAHAN ---
    };

    return (
        <div className="bg-light-bg min-h-screen text-stone-800">
            <div className="flex w-full max-w-screen-xl mx-auto">
                <LeftSidebar auth={auth} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

                <div className="flex-1 w-full lg:ml-24 xl:ml-80">
                    <main className="w-full max-w-none lg:max-w-[600px] min-h-screen border-x-0 lg:border-x border-stone-200">
                        
                        <div className="sticky top-0 bg-light-bg/80 backdrop-blur-md z-10 p-4 border-b border-stone-200 flex items-center gap-4">
                            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-1 rounded-full"><Bars3Icon className="h-6 w-6" /></button>
                            <Link href={`/groups/${group.id}`} className="p-2 rounded-full hover:bg-stone-100 hidden lg:block">
                                <ArrowLeftIcon className="h-5 w-5" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold">Edit Grup</h1>
                                <p className="text-sm text-stone-500 truncate">{group.name}</p>
                            </div>
                        </div>

                        <div className="p-4">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* ... sisa form Anda tidak perlu diubah ... */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold mb-1 text-stone-700">Nama Grup *</label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="w-full bg-stone-100 text-stone-800 border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-semibold mb-1 text-stone-700">Deskripsi</label>
                                    <textarea
                                        id="description"
                                        className="w-full bg-stone-100 text-stone-800 border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={4}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-600 text-white font-bold px-6 py-2 rounded-full hover:bg-blue-700 transition-all shadow hover:shadow-lg disabled:opacity-50"
                                    >
                                        {processing ? 'Memperbarui...' : 'Perbarui Grup'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </main>
                </div>

                <RightSidebar />
            </div>
        </div>
    );
}