import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import LeftSidebar from '@/Components/LeftSidebar';
import RightSidebar from '@/Components/RightSidebar';

// Import Ikon (Ikon Suka dan Komentar sudah dihapus)
import { ArrowLeftIcon } from '@heroicons/react/24/solid';


// Komponen Utama Halaman Detail Postingan Grup (versi sederhana)
export default function PostDetail({ post }) { // 1. Hanya menerima prop 'post'
    const { auth } = usePage().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="bg-light-bg min-h-screen text-stone-800">
            <div className="flex w-full max-w-screen-xl mx-auto">
                <LeftSidebar auth={auth} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                <div className="flex-1 lg:ml-24 xl:ml-80">
                    <main className="w-full max-w-[700px] min-h-screen border-x border-stone-200">
                        
                        {/* Header Halaman */}
                        <div className="sticky top-0 bg-light-bg/80 backdrop-blur-md z-20 p-4 border-b border-stone-200 flex items-center gap-4">
                            {/* Tombol kembali sekarang mengarah ke halaman grup asal */}
                            <Link href={`/groups/${post.group_id}`} className="p-2 rounded-full hover:bg-stone-100">
                                <ArrowLeftIcon className="h-5 w-5" />
                            </Link>
                            <h1 className="text-xl font-bold">Postingan</h1>
                        </div>

                        {/* 2. Konten Postingan yang sudah disederhanakan */}
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0">
        {auth.user.avatar ? (
            // JIKA ADA AVATAR, tampilkan gambar
            <img 
                src={`/storage/${auth.user.avatar}`} 
                className="h-10 w-10 rounded-full object-cover" 
                alt="avatar" 
            />
        ) : (
            // JIKA TIDAK ADA, tampilkan ikon SVG
            <div className="h-10 w-10 rounded-full bg-stone-200 flex items-center justify-center">
                <svg className="h-6 w-6 text-stone-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
                </svg>
            </div>
        )}
    </div>
                                    <div>
                                        <p className="font-bold text-stone-900">{post.user.name}</p>
                                        <p className="text-sm text-stone-500">@{post.user.username || post.user.name.toLowerCase()}</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-xl my-4 whitespace-pre-line">{post.content}</p>
                            {post.image && <img src={`/storage/${post.image}`} alt="Post content" className="w-full rounded-2xl border border-stone-200 object-cover" />}
                            
                            <p className="text-sm text-stone-500 mt-4 pt-4 border-t border-stone-200">
                                Diposting pada {new Date(post.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        
                        {/* 3. Seluruh bagian Suka dan Komentar telah DIHAPUS */}
                        
                    </main>
                </div>
                
                <RightSidebar />
            </div>
        </div>
    );
}