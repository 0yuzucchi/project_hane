import React, { useState } from 'react';
import { Link, useForm, router, usePage } from '@inertiajs/react';
import LeftSidebar from '@/Components/LeftSidebar';
import RightSidebar from '@/Components/RightSidebar';

// Import Ikon
import { ArrowLeftIcon, Bars3Icon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconSolid, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

// Komponen Form Komentar
function CommentForm({ postId }) {
    const { data, setData, post, reset, processing } = useForm({
        post_id: postId,
        body: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/comments', {
            onSuccess: () => reset('body'),
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 border-t border-stone-200 p-4">
            <input
                type="text"
                value={data.body}
                onChange={(e) => setData('body', e.target.value)}
                placeholder="Tulis balasan Anda..."
                className="flex-1 bg-stone-100 border-stone-300 rounded-full px-4 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                disabled={processing || !data.body}
                className="bg-blue-600 text-white font-bold px-4 py-2 rounded-full text-sm hover:bg-blue-700 disabled:opacity-50"
            >
                Balas
            </button>
        </form>
    );
}

// Komponen Modal Pelaporan
function ReportModal({ userToReport, show, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        reason: '',
        details: '',
    });

    const handleReportSubmit = (e) => {
        e.preventDefault();
        post(`/report-user/${userToReport.id}`, {
            onSuccess: () => { reset(); onClose(); },
        });
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
                <h2 className="text-xl font-bold mb-4 text-stone-900">Laporkan @{userToReport.username || userToReport.name}</h2>
                <form onSubmit={handleReportSubmit}>
                    <div className="mb-3">
                        <label className="block text-sm font-semibold mb-1 text-stone-700">Alasan *</label>
                        <input
                            type="text"
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            className="w-full bg-stone-100 border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-blue-500"
                            required
                        />
                        {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-semibold mb-1 text-stone-700">Detail (opsional)</label>
                        <textarea
                            value={data.details}
                            onChange={(e) => setData('details', e.target.value)}
                            className="w-full bg-stone-100 border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-blue-500"
                            rows={4}
                        />
                    </div>
                    <div className="flex justify-end space-x-3 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-stone-200 text-stone-800 font-bold rounded-full hover:bg-stone-300">Batal</button>
                        <button type="submit" disabled={processing} className="px-4 py-2 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 disabled:opacity-50">Kirim Laporan</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


// Komponen Utama Halaman Detail Postingan
export default function PostDetail({ post, hasLiked, likesCount }) {
    const { auth } = usePage().props;
    const { post: likePost } = useForm();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showPostOptions, setShowPostOptions] = useState(false);

    const toggleLike = () => {
        likePost(`/posts/${post.id}/like`, { preserveScroll: true });
    };

    return (
        <div className="bg-light-bg min-h-screen text-stone-800">
            <ReportModal userToReport={post.user} show={showReportModal} onClose={() => setShowReportModal(false)} />

            <div className="flex w-full max-w-screen-xl mx-auto">
                <LeftSidebar auth={auth} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

                <div className="flex-1 w-full lg:ml-24 xl:ml-80">
                    <main className="w-full max-w-none lg:max-w-[700px] min-h-screen border-x-0 lg:border-x border-stone-200">

                        {/* Header Halaman Detail */}
                        <div className="sticky top-0 bg-light-bg/80 backdrop-blur-md z-20 px-4 py-3 border-b border-stone-200 flex items-center gap-4">
                            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-1 rounded-full"><Bars3Icon className="h-6 w-6" /></button>
                            <Link href="/dashboard" className="p-2 rounded-full hover:bg-stone-100 hidden lg:block"><ArrowLeftIcon className="h-5 w-5" /></Link>
                            <h1 className="text-xl font-bold">Postingan</h1>
                        </div>

                        {/* Konten Postingan */}
                        <div className="p-3 sm:p-4">
                            <div className="flex items-center justify-between">
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

                                <div className="relative">
                                    <button onClick={() => setShowPostOptions(!showPostOptions)} className="text-stone-500 p-2 rounded-full hover:bg-stone-100">
                                        <EllipsisHorizontalIcon className="h-5 w-5" />
                                    </button>
                                    {showPostOptions && (
                                        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-stone-200 shadow-lg rounded-xl z-10">
                                            <button onClick={() => { setShowReportModal(true); setShowPostOptions(false); }} className="w-full text-left flex items-center gap-3 px-4 py-3 text-red-600 font-bold hover:bg-stone-100">
                                                <ExclamationTriangleIcon className="h-5 w-5" />
                                                <span>Laporkan</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="min-w-0">
                                <p className="text-lg sm:text-xl my-4 whitespace-pre-line break-words">{post.content}</p>
                                {post.image && (
                                    <div className="mt-3 w-full rounded-2xl border border-stone-200 overflow-hidden bg-stone-100">
                                        <img src={`/storage/${post.image}`} alt="Post content" className="w-full h-full max-h-[600px] object-contain" />
                                    </div>
                                )}
                            </div>

                            <p className="text-sm text-stone-500 mt-4 border-b border-stone-200 pb-4">
                                {new Date(post.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>

                            <div className="flex items-center gap-4 py-4 border-b border-stone-200">
                                <span className="text-sm"><strong className="text-stone-800">{likesCount}</strong> <span className="text-stone-500">Suka</span></span>
                            </div>

                            <div className="flex justify-around py-2">
                                <button onClick={toggleLike} className="flex items-center gap-2 text-stone-600 hover:text-red-500 group transition-colors">
                                    {hasLiked ? <HeartIconSolid className="h-6 w-6 text-red-500" /> : <HeartIconOutline className="h-6 w-6" />}
                                    <span className={`font-semibold ${hasLiked ? 'text-red-500' : ''}`}>{hasLiked ? 'Disukai' : 'Suka'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Form dan Daftar Komentar */}
                        <CommentForm postId={post.id} />

                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((comment) => (
                                <div key={comment.id} className="p-3 sm:p-4 border-b border-stone-200 flex gap-3 sm:gap-4">
                                    <div className="flex-shrink-0">
                                        {comment.user.avatar ? (
                                            // JIKA ADA AVATAR, tampilkan gambar
                                            <img
                                                src={`/storage/${comment.user.avatar}`}
                                                alt={comment.user.name}
                                                className="h-10 w-10 rounded-full object-cover"
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

                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="font-bold text-stone-800">{comment.user.name}</span>
                                            <span className="text-stone-500">@{comment.user.username || 'user'}</span>
                                        </div>
                                        <p className="text-stone-800 mt-1 break-words">{comment.body}</p>
                                    </div>

                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-stone-500 text-center py-4">Belum ada komentar.</p>
                        )}
                    </main>
                </div>

                <RightSidebar />
            </div>
        </div>
    );
}