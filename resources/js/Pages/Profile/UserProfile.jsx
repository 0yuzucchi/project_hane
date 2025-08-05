import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import LeftSidebar from '@/Components/LeftSidebar';
import RightSidebar from '@/Components/RightSidebar';

// Import Ikon
import { ArrowLeftIcon, CalendarDaysIcon, Bars3Icon, TrashIcon, UserPlusIcon, ClockIcon, CheckIcon } from '@heroicons/react/24/solid';
import { EllipsisHorizontalIcon, HeartIcon as HeartIconOutline, ChatBubbleOvalLeftIcon, ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

// ===================================================================
// ====> PENYESUAIAN 1: Tambahkan kembali definisi komponen yang hilang <====
// ===================================================================

// Komponen Aksi Postingan
function PostActions({ post, auth }) {
    if (!auth || !auth.user) return null; // Pengaman jika tidak ada user login
    
    const hasLiked = post.likes && post.likes.some((like) => like.user_id === auth.user.id);
    const toggleLike = (e) => {
        e.stopPropagation();
        router.post(`/posts/${post.id}/like`, {}, { preserveScroll: true });
    };

    return (
        <div className="mt-4 flex justify-between items-center text-stone-500 max-w-xs">
            <div className="flex items-center gap-1 group">
                <button type="button" onClick={(e) => e.stopPropagation()} className="p-2 rounded-full group-hover:bg-blue-500/10"><ChatBubbleOvalLeftIcon className="h-5 w-5 group-hover:text-blue-600" /></button>
                <span className="text-sm group-hover:text-blue-600">{post.comments_count || 0}</span>
            </div>
            <div className="flex items-center gap-1 group">
                <button type="button" onClick={toggleLike} className="p-2 rounded-full group-hover:bg-red-500/10">{hasLiked ? (<HeartIconSolid className="h-5 w-5 text-red-500" />) : (<HeartIconOutline className="h-5 w-5 group-hover:text-red-500" />)}</button>
                <span className={`text-sm ${hasLiked ? 'text-red-500' : 'group-hover:text-red-500'}`}>{post.likes ? post.likes.length : 0}</span>
            </div>
            <div className="flex items-center gap-1 group">
                <button type="button" onClick={(e) => e.stopPropagation()} className="p-2 rounded-full group-hover:bg-sky-500/10"><ArrowUpOnSquareIcon className="h-5 w-5 group-hover:text-sky-600" /></button>
            </div>
        </div>
    );
}

// Komponen Kartu Postingan
function ProfilePostCard({ post, auth }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Guard clause: jangan render jika data post atau user tidak lengkap
    if (!post || !post.user) {
        return null;
    }

    // Cek kepemilikan hanya jika ada pengguna yang login
    const isOwner = auth && auth.user && auth.user.id === post.user.id;

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm('Apakah Anda yakin ingin menghapus postingan ini?')) {
            router.delete(`/posts/${post.id}`, {
                preserveScroll: true,
            });
        }
        setIsMenuOpen(false);
    };

    return (
        <article onClick={() => router.get(`/posts/${post.id}`)} className="px-3 sm:px-4 py-4 border-b border-stone-200 hover:bg-stone-100 cursor-pointer">
            <div className="flex gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                    {post.user.avatar ? (
                        <img src={`/storage/${post.user.avatar}`} alt={post.user.name} className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover" />
                    ) : (
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-stone-200 flex items-center justify-center">
                            <svg className="h-6 w-6 sm:h-7 sm:w-7 text-stone-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" /></svg>
                        </div>
                    )}
                </div>
                <div className="w-full min-w-0">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 text-sm flex-wrap">
                            <span className="font-bold">{post.user.name}</span>
                            <span className="text-stone-500">@{post.user.username || 'user'}</span>
                            <span className="text-stone-500">·</span>
                            <span className="text-stone-500">{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        {isOwner && (
                            <div className="relative">
                                <button type="button" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }} className="text-stone-500 p-2 -mt-2 rounded-full hover:bg-blue-500/10">
                                    <EllipsisHorizontalIcon className="h-5 w-5" />
                                </button>
                                {isMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}></div>
                                        <div className="absolute top-8 right-0 bg-white border border-stone-200 rounded-lg shadow-lg z-20 w-40">
                                            <ul>
                                                <li>
                                                    <button type="button" onClick={handleDelete} className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                                                        <TrashIcon className="h-4 w-4" />
                                                        Hapus Postingan
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <p className="whitespace-pre-line break-words mt-1 text-base text-stone-800">{post.content}</p>
                    {post.image && (
                        <div className="mt-3 w-full rounded-2xl border border-stone-200 overflow-hidden bg-stone-100">
                            <img src={`/storage/${post.image}`} alt="Post" className="w-full h-full max-h-[500px] object-contain" />
                        </div>
                    )}
                    <PostActions post={post} auth={auth} />
                </div>
            </div>
        </article>
    );
}

// Komponen Tombol Pertemanan (Tidak diubah)
function FriendshipButton({ user, status }) {
    if (!status) {
        return (
            <button onClick={() => router.post(`/friend-request/${user.id}`)} className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded-full hover:bg-blue-700 transition mt-4 sm:mt-0">
                Tambah Teman
            </button>
        );
    }
    if (status.status === 'accepted') {
        return (
            <button disabled className="bg-green-100 text-green-800 font-bold px-4 py-1.5 rounded-full mt-4 sm:mt-0 flex items-center gap-2">
                <CheckIcon className="h-5 w-5" /> Berteman
            </button>
        );
    }
    if (status.status === 'pending') {
        if (status.sent_by_me) {
            return (
                <button disabled className="bg-stone-200 text-stone-700 font-bold px-4 py-1.5 rounded-full mt-4 sm:mt-0 flex items-center gap-2">
                    <ClockIcon className="h-5 w-5" /> Terkirim
                </button>
            );
        } else {
             return (
                <Link href="/friendships" className="bg-yellow-100 text-yellow-800 font-bold px-4 py-1.5 rounded-full hover:bg-yellow-200 transition mt-4 sm:mt-0">
                    Respons Permintaan
                </Link>
            );
        }
    }
    return null;
}

// Komponen Utama Halaman Profil PUBLIK
export default function UserProfile({ user, posts, friendsCount, friendshipStatus}) { // Terima props grup
    const { auth } = usePage().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (auth.user && auth.user.id === user.id) {
            router.visit('/profile', { replace: true });
        }
    }, [auth.user, user]);

    return (
        <div className="bg-light-bg min-h-screen text-stone-800">
            <div className="flex w-full max-w-screen-xl mx-auto">
                <LeftSidebar auth={auth} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

                <div className="flex-1 w-full lg:ml-24 xl:ml-80">
                    <main className="w-full max-w-none lg:max-w-[600px] min-h-screen border-x-0 lg:border-x border-stone-200">
                        {/* Header Profil */}
                        <div className="sticky top-0 bg-light-bg/80 backdrop-blur-md z-20 px-4 py-3 border-b border-stone-200 flex items-center gap-4">
                            <button type="button" onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-1 rounded-full hover:bg-stone-100"><Bars3Icon className="h-6 w-6" /></button>
                            <button onClick={() => window.history.back()} className="p-2 rounded-full hover:bg-stone-100 hidden lg:block"><ArrowLeftIcon className="h-5 w-5" /></button>
                            <div>
                                <h1 className="text-xl font-bold">{user.name}</h1>
                                <p className="text-sm text-stone-500">{user.posts_count} Postingan</p>
                            </div>
                        </div>

                        {/* Area Informasi Profil */}
                        <div className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                                <div className="flex-shrink-0">
                                    {user.avatar ? (
                                        <img src={`/storage/${user.avatar}`} alt="Avatar" className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-md" />
                                    ) : (
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-stone-200 flex items-center justify-center border-4 border-white shadow-md">
                                            <svg className="h-16 w-16 text-stone-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" /></svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 w-full">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-start w-full">
                                        <div>
                                            <h2 className="text-2xl font-bold">{user.name}</h2>
                                            <p className="text-stone-500">@{user.username || user.email}</p>
                                        </div>
                                        {auth.user && (
                                             <FriendshipButton user={user} status={friendshipStatus} />
                                        )}
                                    </div>
                                    <p className="mt-3 text-stone-700">{user.bio || 'Pengguna ini belum menambahkan bio.'}</p>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-stone-500 mt-4 text-sm">
                                        <div className="flex items-center gap-1.5">
                                            <CalendarDaysIcon className="h-5 w-5" />
                                            <span>Bergabung {new Date(user.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
                                        </div>
                                        <p><strong className="text-stone-900">{friendsCount}</strong> Teman</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Daftar Postingan */}
                        <div className="border-t border-stone-200">
                            <h3 className="p-4 text-xl font-bold">Postingan</h3>
                            {posts && posts.length > 0 ? (
                                posts.map(post => <ProfilePostCard key={post.id} post={post} auth={auth} />)
                            ) : (
                                <p className="p-4 text-stone-500">Pengguna ini belum memiliki postingan.</p>
                            )}
                        </div>
                    </main>
                </div>

                {/* PENYESUAIAN 2: Teruskan props grup ke RightSidebar */}
                <RightSidebar />
            </div>
        </div>
    );
}
