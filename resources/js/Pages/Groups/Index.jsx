import React, { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import LeftSidebar from '@/Components/LeftSidebar';
import RightSidebar from '@/Components/RightSidebar';
import { Bars3Icon, CheckCircleIcon } from '@heroicons/react/24/solid';

// ===================================================================
// ====> 1. PERBARUI GroupCard UNTUK MENERIMA STATUS 'processing' <====
// ===================================================================
function GroupCard({ group, onJoin, processingId }) {
    const isMember = group.is_member;
    
    // Tombol akan dalam status "processing" jika ID grup ini sama dengan ID yang sedang diproses
    const isProcessing = processingId === group.id;

    const handleJoinClick = (e) => {
        e.preventDefault(); // Gunakan preventDefault untuk memastikan link tidak terpicu
        e.stopPropagation();
        
        // Jangan lakukan apa-apa jika tombol sudah dalam proses
        if (isProcessing) return;

        onJoin(group.id);
    };

    return (
        <Link
            href={`/groups/${group.id}`}
            className="group bg-white border border-stone-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow duration-300"
        >
            <div>
                <p className="block text-xl font-bold text-stone-900 group-hover:text-blue-600 transition-colors">
                    {group.name}
                </p>
                <p className="text-base text-stone-500 mt-1 h-12 overflow-hidden">
                    {group.description || 'Tidak ada deskripsi.'}
                </p>
                <div className="mt-3 flex items-center gap-4 text-sm text-stone-500">
                    <span>{group.users_count ?? 0} anggota</span>
                    <span>·</span>
                    <span>{group.group_posts_count ?? 0} postingan</span>
                </div>
            </div>
            <div className="mt-4">
                {isMember ? (
                    <div className="flex items-center gap-2 text-green-600 font-semibold py-1.5">
                        <CheckCircleIcon className="h-5 w-5" />
                        <span>Telah Bergabung</span>
                    </div>
                ) : (
                    <button
                        onClick={handleJoinClick}
                        // Tombol dinonaktifkan saat sedang diproses
                        disabled={isProcessing}
                        className="w-full sm:w-auto bg-blue-600 text-white font-bold px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-wait"
                    >
                        {/* Teks tombol berubah secara dinamis */}
                        {isProcessing ? 'Memproses...' : 'Join Grup'}
                    </button>
                )}
            </div>
        </Link>
    );
}

// Komponen Utama Halaman Daftar Grup
export default function Index() {
    // Pastikan menerima props grup untuk RightSidebar
    const { groups = [], auth, myGroups: myGroupsProp, recommendedGroups } = usePage().props;
    const { post, processing } = useForm();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // ===================================================================
    // ====> 2. TAMBAHKAN STATE UNTUK MELACAK ID YANG SEDANG DIPROSES <====
    // ===================================================================
    const [processingId, setProcessingId] = useState(null);

    const myGroups = groups.filter(group => group.owner_id === auth.user.id);
    const otherGroups = groups.filter(group => group.owner_id !== auth.user.id);

    // ===================================================================
    // ====> 3. PERBARUI 'handleJoin' DENGAN LOGIKA STATE BARU <====
    // ===================================================================
    const handleJoin = (groupId) => {
        setProcessingId(groupId); // Set ID grup yang sedang diproses
        post(`/groups/${groupId}/join`, {
            preserveScroll: true,
            onFinish: () => {
                setProcessingId(null); // Reset ID setelah proses selesai (baik sukses maupun gagal)
            },
        });
    };

    return (
        <div className="bg-light-bg min-h-screen text-stone-800">
            <div className="flex w-full max-w-screen-xl mx-auto">
                <LeftSidebar auth={auth} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

                <div className="flex-1 lg:ml-24 xl:ml-80">
                    <main className="w-full max-w-[600px] min-h-screen border-x border-stone-200">
                        
                        {/* Header Desktop & Mobile (tidak diubah) */}
                        <div className="sticky top-0 bg-light-bg/80 backdrop-blur-md z-10 px-4 py-3 border-b border-stone-200 hidden lg:flex justify-between items-center">
                            <h1 className="text-xl font-bold">Grup</h1>
                            <Link href="/groups/create" className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded-full text-sm hover:bg-blue-700 shadow-sm">Buat Grup</Link>
                        </div>
                        <div className="sticky top-0 bg-light-bg/80 backdrop-blur-md z-10 px-4 py-2 border-b border-stone-200 flex items-center justify-between lg:hidden">
                            <button onClick={() => setIsMobileMenuOpen(true)} className="p-1"><Bars3Icon className="h-6 w-6 text-stone-800" /></button>
                            <h1 className="text-xl font-bold">Grup</h1>
                            <Link href="/groups/create" className="bg-blue-600 text-white font-bold px-3 py-1 rounded-full text-xs hover:bg-blue-700 shadow-sm">Buat</Link>
                        </div>

                        {/* Konten Utama */}
                        <div className="p-4 space-y-10">
                            {groups.length === 0 ? (
                                <p className="text-stone-500 text-center py-8">Belum ada grup yang tersedia.</p>
                            ) : (
                                <>
                                    <section>
                                        <h2 className="text-xl font-bold text-stone-800 mb-4 px-1">Grup yang Anda Kelola</h2>
                                        {myGroups.length > 0 ? (
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {myGroups.map(group => (
                                                    <GroupCard key={group.id} group={group} onJoin={handleJoin} processingId={processingId} />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-stone-500 text-sm px-1">Anda belum membuat atau mengelola grup apa pun.</p>
                                        )}
                                    </section>
                                    {otherGroups.length > 0 && (
                                        <section>
                                            <h2 className="text-xl font-bold text-stone-800 mb-4 px-1">Jelajahi Grup Lainnya</h2>
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {otherGroups.map(group => (
                                                    // Teruskan prop 'processingId' ke setiap kartu
                                                    <GroupCard key={group.id} group={group} onJoin={handleJoin} processingId={processingId} />
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </>
                            )}
                        </div>
                    </main>
                </div>

                <RightSidebar myGroups={myGroupsProp} recommendedGroups={recommendedGroups} />
            </div>
        </div>
    );
}