import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import LeftSidebar from '@/Components/LeftSidebar';
import RightSidebar from '@/Components/RightSidebar';
import { Bars3Icon, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline, ChatBubbleOvalLeftIcon, ArrowUpOnSquareIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';


function PostActions({ post, auth }) {
    const hasLiked = post.likes.some((like) => like.user_id === auth.user.id);
    const toggleLike = (e) => { e.stopPropagation(); router.post(`/posts/${post.id}/like`, {}, { preserveScroll: true }); };

    return (
        <div className="mt-4 flex justify-between items-center text-stone-500 max-w-xs">
            <div className="flex items-center gap-1 group"><button onClick={(e) => e.stopPropagation()} className="p-2 rounded-full group-hover:bg-blue-500/10"><ChatBubbleOvalLeftIcon className="h-5 w-5 group-hover:text-blue-600" /></button><span className="text-sm group-hover:text-blue-600">{post.comments_count || 0}</span></div>
            <div className="flex items-center gap-1 group"><button onClick={toggleLike} className="p-2 rounded-full group-hover:bg-red-500/10">{hasLiked ? (<HeartIconSolid className="h-5 w-5 text-red-500" />) : (<HeartIconOutline className="h-5 w-5 group-hover:text-red-500" />)}</button><span className={`text-sm ${hasLiked ? 'text-red-500' : 'group-hover:text-red-500'}`}>{post.likes.length}</span></div>
            <div className="flex items-center gap-1 group"><button onClick={(e) => e.stopPropagation()} className="p-2 rounded-full group-hover:bg-sky-500/10"><ArrowUpOnSquareIcon className="h-5 w-5 group-hover:text-sky-600" /></button></div>
        </div>
    );
}

const CompanyLogo = () => (
    <span className="text-xl font-bold text-stone-800">Hane</span>
);

export default function Dashboard({ posts = [] }) {
    const { auth } = usePage().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigateToPost = (id) => { router.get(`/posts/${id}`); };

    return (
        <div className="bg-light-bg min-h-screen text-stone-800">
            <div className="flex w-full max-w-screen-xl mx-auto">
                <LeftSidebar auth={auth} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

                {/* 1. PERBAIKAN RESPONSIVE MARGIN KONTEN UTAMA */}
                {/* lg:ml-24 dan xl:ml-80 hanya berlaku di layar besar, di mobile marginnya 0 */}
                <div className="flex-1 w-full lg:ml-24 xl:ml-80">
                    {/* 2. PERBAIKAN LEBAR KONTEN UTAMA */}
                    {/* Di mobile (default), max-w-none agar menggunakan lebar penuh. Di desktop, kembali ke max-w-[600px] */}
                    <main className="w-full max-w-none lg:max-w-[600px] min-h-screen border-x-0 lg:border-x border-stone-200">

                        {/* Header dengan tema terang */}
                        <div className="sticky top-0 bg-light-bg/80 backdrop-blur-md z-10 px-4 py-3 border-b border-stone-200 hidden lg:block">
                            <h1 className="text-xl font-bold">Beranda</h1>
                        </div>
                        <div className="sticky top-0 bg-light-bg/80 backdrop-blur-md z-10 px-4 py-2 border-b border-stone-200 flex items-center justify-between lg:hidden">
                            <button onClick={() => setIsMobileMenuOpen(true)}><Bars3Icon className="h-6 w-6 text-stone-800" /></button>
                            <CompanyLogo />
                            <div></div>
                        </div>

                        {/* Kotak "Apa yang kamu pikirkan?" dengan avatar SVG default */}
                        <div className="p-4 border-b border-stone-200">
                            <Link href="/posts/create" className="flex items-center gap-4 w-full group">

                                {/* ========================================================= */}
                                {/* ====> PERUBAHAN UTAMA: AVATAR KONDISIONAL DENGAN SVG <==== */}
                                {/* ========================================================= */}
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
                                {/* ========================================================= */}
                                {/* ========================================================= */}

                                <div className="flex-grow bg-stone-100 border border-stone-200/80 rounded-full px-4 py-2 group-hover:bg-stone-200/70 transition-colors duration-200">
                                    <span className="text-stone-500">Apa yang kamu pikirkan?</span>
                                </div>
                            </Link>
                        </div>


                        {/* Feed Postingan dengan tema terang */}
                        <div className="flow-root">
                            {posts.map((post) => (
                                // 3. PERBAIKAN PADDING DI KARTU POSTINGAN
                                // Padding horizontal (px) lebih kecil di mobile, dan lebih besar di desktop (sm:px-4)
                                <article key={post.id} onClick={() => navigateToPost(post.id)} className="px-3 sm:px-4 py-4 border-b border-stone-200 hover:bg-stone-100 cursor-pointer transition-colors duration-200">
                                    <div className="flex gap-3 sm:gap-4">
                                        {/* 4. PERBAIKAN UKURAN AVATAR */}
                                            <div className="flex-shrink-0">
        {post.user.avatar ? (
            // JIKA ADA AVATAR, tampilkan gambar
            <img 
                src={`/storage/${post.user.avatar}`} 
                alt={post.user.name} 
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover" 
            />
        ) : (
            // JIKA TIDAK ADA, tampilkan ikon SVG
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-stone-200 flex items-center justify-center">
                <svg className="h-6 w-6 sm:h-7 sm:w-7 text-stone-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
                </svg>
            </div>
        )}
    </div>
                                        <div className="w-full min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-2 text-sm flex-wrap">
                                                    <span className="font-bold hover:underline">{post.user.name}</span>
                                                    <span className="text-stone-500">@{post.user.username || post.user.name.toLowerCase().replace(' ', '')}</span>
                                                    <span className="text-stone-500">·</span>
                                                    <span className="text-stone-500 hover:underline">{new Date(post.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <button onClick={(e) => e.stopPropagation()} className="text-stone-500 p-2 -mt-2 rounded-full hover:bg-blue-500/10 hover:text-blue-600">
                                                    <EllipsisHorizontalIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                            <p className="whitespace-pre-line break-words text-base mt-1 text-stone-800">{post.content}</p>
                                            {post.image && (
                                                <div className="mt-3 w-full rounded-2xl border border-stone-200 overflow-hidden bg-stone-100">
                                                    <img src={`/storage/${post.image}`} alt="Post content" className="w-full h-full max-h-[500px] object-contain" />
                                                </div>
                                            )}
                                            <PostActions post={post} auth={auth} />
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </main>
                </div>

                <RightSidebar />
            </div>
        </div>
    );
}