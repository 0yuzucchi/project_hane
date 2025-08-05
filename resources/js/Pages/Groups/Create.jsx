import React, { useState } from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import LeftSidebar from '@/Components/LeftSidebar';
import RightSidebar from '@/Components/RightSidebar';

// Import Ikon
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

// Komponen Utama Halaman Buat Grup
export default function Create() {
    // Pastikan untuk menerima props grup untuk RightSidebar
    const { auth } = usePage().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // ===================================================================
    // ====> 1. TAMBAHKAN KONSTANTA UNTUK BATAS KARAKTER DESKRIPSI <====
    // ===================================================================
    const MAX_DESC_CHARS = 255; // Sesuaikan dengan batas di database Anda

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    // Hitung sisa karakter untuk deskripsi
    const charsRemaining = MAX_DESC_CHARS - data.description.length;

    // ===================================================================
    // ====> 2. BUAT HANDLER BARU UNTUK DESKRIPSI DENGAN VALIDASI <====
    // ===================================================================
    const handleDescriptionChange = (e) => {
        const newDescription = e.target.value;
        // Hanya update state jika panjangnya tidak melebihi batas
        if (newDescription.length <= MAX_DESC_CHARS) {
            setData('description', newDescription);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Fungsi submit tidak perlu diubah
        post('/groups');
    };

    return (
        <div className="bg-light-bg min-h-screen text-stone-800">
            <div className="flex w-full max-w-screen-xl mx-auto">
                <LeftSidebar auth={auth} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

                <div className="flex-1 lg:ml-24 xl:ml-80">
                    <main className="w-full max-w-none lg:max-w-[600px] min-h-screen border-x-0 lg:border-x border-stone-200">
                        
                        <div className="sticky top-0 bg-light-bg/80 backdrop-blur-md z-10 p-4 border-b border-stone-200 flex items-center gap-4">
                            <Link href="/groups" className="p-2 rounded-full hover:bg-stone-100">
                                <ArrowLeftIcon className="h-5 w-5" />
                            </Link>
                            <h1 className="text-xl font-bold">Buat Grup Baru</h1>
                        </div>

                        <div className="p-4 sm:p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold mb-1 text-stone-700">Nama Grup *</label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="w-full bg-stone-100 text-stone-800 border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        disabled={processing}
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-semibold mb-1 text-stone-700">Deskripsi (opsional)</label>
                                    <textarea
                                        id="description"
                                        className="w-full bg-stone-100 text-stone-800 border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={4}
                                        value={data.description}
                                        // Gunakan handler baru yang sudah ada validasinya
                                        onChange={handleDescriptionChange}
                                        disabled={processing}
                                    />
                                    {/* =================================================================== */}
                                    {/* ====> 3. TAMPILKAN PENGHITUNG KARAKTER <====                      */}
                                    {/* =================================================================== */}
                                    <div className="text-right text-xs mt-1 font-medium">
                                        <span className={charsRemaining < 0 ? 'text-red-500' : 'text-stone-500'}>
                                            {charsRemaining} karakter tersisa
                                        </span>
                                    </div>
                                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        // ===================================================================
                                        // ====> 4. PERBARUI LOGIKA DISABLED PADA TOMBOL <====
                                        // ===================================================================
                                        disabled={processing || !data.name.trim() || charsRemaining < 0}
                                        className="bg-blue-600 text-white font-bold px-6 py-2 rounded-full hover:bg-blue-700 transition-all shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Menyimpan...' : 'Buat Grup'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </main>
                </div>

                {/* Teruskan props grup ke RightSidebar */}
                <RightSidebar />
            </div>
        </div>
    );
}