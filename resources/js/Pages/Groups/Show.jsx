import React, { useState, useRef } from 'react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import LeftSidebar from '@/Components/LeftSidebar';
import RightSidebar from '@/Components/RightSidebar';

// Import Ikon
import { ArrowLeftIcon, Bars3Icon, UserIcon, PencilIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

// ===================================================================
// Komponen-komponen pendukung yang diperlukan
// ===================================================================

function GroupPostCard({ post }) {
    // Guard clause untuk data yang tidak lengkap
    if (!post || !post.user) return null;

    return (
        <article onClick={() => router.get(`/group-posts/${post.id}`)} className="px-3 sm:px-4 py-4 border-b border-stone-200 hover:bg-stone-100 cursor-pointer transition-colors duration-200">
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
                        <button type="button" onClick={(e) => e.stopPropagation()} className="text-stone-500 p-2 -mt-2 rounded-full hover:bg-blue-100 hover:text-blue-600">
                            <EllipsisHorizontalIcon className="h-5 w-5" />
                        </button>
                    </div>
                    <p className="whitespace-pre-line break-words mt-1 text-base text-stone-800">{post.content}</p>
                    {post.image && (
                        <div className="mt-3 w-full rounded-2xl border border-stone-200 overflow-hidden bg-stone-100">
                            <img src={`/storage/${post.image}`} alt="Post" className="w-full h-full max-h-[500px] object-contain" />
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}

function MembersModal({ show, onClose, group }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-4 text-stone-900">Anggota Grup</h3>
                <ul className="space-y-2 max-h-80 overflow-y-auto">
                    {group.users.map((user) => (
                        <li key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-stone-100">
                            <div className="flex-shrink-0">
                                {user.avatar ? (
                                    <img src={`/storage/${user.avatar}`} alt={user.name} className="h-10 w-10 rounded-full object-cover"/>
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-stone-200 flex items-center justify-center">
                                        <svg className="h-6 w-6 text-stone-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" /></svg>
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="font-semibold">{user.name}</p>
                                {user.id === group.owner_id && <span className="text-xs text-stone-500">Pemilik</span>}
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="text-right mt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-stone-200 text-stone-800 font-bold rounded-full hover:bg-stone-300">Tutup</button>
                </div>
            </div>
        </div>
    );
}


// Komponen Utama Halaman Detail Grup
export default function Show({ group, groupPosts, storeGroupPostUrl, myGroups, recommendedGroups }) {
    const { auth } = usePage().props;
    const isOwner = group.owner_id === auth?.user?.id;
    const isMember = group.users.some(user => user.id === auth.user.id);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showMembers, setShowMembers] = useState(false);

    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    // ===================================================================
    // ====> 1. TAMBAHKAN STATE & KONSTANTA UNTUK VALIDASI <====
    // ===================================================================
    const MAX_CHARS = 500;
    const MAX_FILE_SIZE_MB = 2;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
    const [imageError, setImageError] = useState('');

    const { data, setData, post, processing, reset, errors } = useForm({
        content: '',
        image: null,
    });

    const charsRemaining = MAX_CHARS - data.content.length;

    // ===================================================================
    // ====> 2. SESUAIKAN HANDLER DENGAN LOGIKA VALIDASI <====
    // ===================================================================
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE_BYTES) {
                setImageError(`Ukuran file tidak boleh lebih dari ${MAX_FILE_SIZE_MB}MB.`);
                setData('image', null);
                setImagePreview(null);
                e.target.value = null;
                return;
            }
            setImageError('');
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleContentChange = (e) => {
        const newContent = e.target.value;
        if (newContent.length <= MAX_CHARS) {
            setData('content', newContent);
        }
    };

    const removeImagePreview = () => {
        setData('image', null);
        setImagePreview(null);
        setImageError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    const submitPost = (e) => {
        e.preventDefault();
        if (imageError || charsRemaining < 0) return;

        post(storeGroupPostUrl, {
            forceFormData: true,
            onSuccess: () => {
                reset('content', 'image');
                setImagePreview(null);
                setImageError('');
                if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                }
            },
            preserveScroll: true,
        });
    };

    return (
        <div className="bg-light-bg min-h-screen text-stone-800">
            <MembersModal show={showMembers} onClose={() => setShowMembers(false)} group={group} />
            <div className="flex w-full max-w-screen-xl mx-auto">
                <LeftSidebar auth={auth} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                <div className="flex-1 w-full lg:ml-24 xl:ml-80">
                    <main className="w-full max-w-none lg:max-w-[600px] min-h-screen border-x-0 lg:border-x border-stone-200">

                        <div className="sticky top-0 bg-light-bg/80 backdrop-blur-md z-20 px-4 py-3 border-b border-stone-200 flex items-center gap-4">
                            <button type="button" onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-1 rounded-full"><Bars3Icon className="h-6 w-6" /></button>
                            <Link href="/groups" className="p-2 rounded-full hover:bg-stone-100 hidden lg:block"><ArrowLeftIcon className="h-5 w-5" /></Link>
                            <div>
                                <h1 className="text-xl font-bold truncate">{group.name}</h1>
                                <p className="text-sm text-stone-500">{group.users.length} Anggota</p>
                            </div>
                        </div>

                        <div className="p-3 sm:p-4 border-b border-stone-200">
                            <div className="min-w-0">
                                <p className="text-lg mb-4 break-words">{group.description || 'Tidak ada deskripsi.'}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button type="button" onClick={() => setShowMembers(true)} className="flex items-center gap-2 text-sm text-stone-600 hover:underline">
                                    <UserIcon className="h-4 w-4" /> Lihat Anggota
                                </button>
                                {isOwner && (
                                    <Link href={`/groups/${group.id}/edit`} className="flex items-center gap-2 text-sm text-stone-600 hover:underline">
                                        <PencilIcon className="h-4 w-4" /> Edit Grup
                                    </Link>
                                )}
                            </div>
                        </div>

                        {isMember && (
                            <div className="p-3 sm:p-4 border-b border-stone-200">
                                <form onSubmit={submitPost} className="space-y-3">
                                    <div className="flex gap-3 sm:gap-4">
                                        <div className="flex-shrink-0">
                                            {auth.user.avatar ? (
                                                <img src={`/storage/${auth.user.avatar}`} className="h-10 w-10 rounded-full object-cover" alt="avatar" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-stone-200 flex items-center justify-center">
                                                    <svg className="h-6 w-6 text-stone-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" /></svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-full min-w-0">
                                            <textarea
                                                value={data.content}
                                                onChange={handleContentChange}
                                                className="w-full bg-stone-100 border-stone-300 rounded-lg p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Tulis sesuatu di grup ini..."
                                                rows={2}
                                            />
                                        </div>
                                    </div>

                                    {imagePreview && (
                                        <div className="relative ml-12 sm:ml-14">
                                            <img src={imagePreview} alt="Pratinjau Gambar" className="rounded-2xl border border-stone-200 max-h-80 w-auto" />
                                            <button
                                                type="button"
                                                onClick={removeImagePreview}
                                                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors"
                                            >
                                                <XMarkIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center ml-12 sm:ml-14">
                                        <div className="flex items-center gap-4">
                                            <input type="file" id="image-upload" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef}/>
                                            <label htmlFor="image-upload" className="cursor-pointer text-blue-600 p-2 rounded-full hover:bg-blue-100">
                                                <PhotoIcon className="h-6 w-6" />
                                            </label>
                                            
                                            {/* =================================================================== */}
                                            {/* ====> 3. TAMBAHKAN PETUNJUK & PENGHITUNG KARAKTER <====            */}
                                            {/* =================================================================== */}
                                            <span className="text-xs text-stone-500 hidden sm:inline">Maks: {MAX_FILE_SIZE_MB}MB</span>
                                            <span className={`text-sm font-semibold ${charsRemaining < 20 ? 'text-red-500' : 'text-stone-500'}`}>
                                                {charsRemaining}
                                            </span>
                                        </div>

                                        <button
                                            type="submit"
                                            // 4. Perbarui logika disabled
                                            disabled={processing || (!data.content.trim() && !data.image) || charsRemaining < 0 || !!imageError}
                                            className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded-full text-sm hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {processing ? 'Mengirim...' : 'Kirim'}
                                        </button>
                                    </div>
                                    {/* =================================================================== */}
                                    {/* ====> 5. TAMPILKAN ERROR VALIDASI KLIEN & SERVER <====            */}
                                    {/* =================================================================== */}
                                    {imageError && <p className="text-red-500 text-xs mt-1 ml-12 sm:ml-14">{imageError}</p>}
                                    {errors.content && <p className="text-red-500 text-xs mt-1 ml-12 sm:ml-14">{errors.content}</p>}
                                    {errors.image && <p className="text-red-500 text-xs mt-1 ml-12 sm:ml-14">{errors.image}</p>}
                                </form>
                            </div>
                        )}

                        <div>
                            {groupPosts.length > 0 ? (
                                groupPosts.map((post) => <GroupPostCard key={post.id} post={post} />)
                            ) : (
                                <p className="p-4 text-stone-500 text-center">Jadilah yang pertama posting di grup ini!</p>
                            )}
                        </div>
                    </main>
                </div>
                <RightSidebar myGroups={myGroups} recommendedGroups={recommendedGroups} />
            </div>
        </div>
    );
}