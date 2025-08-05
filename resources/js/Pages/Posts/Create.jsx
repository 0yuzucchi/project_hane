import React, { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import LeftSidebar from '@/Components/LeftSidebar';
import RightSidebar from '@/Components/RightSidebar';

// Import Ikon
import { ArrowLeftIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/solid';

// Komponen Utama Halaman Buat Postingan
export default function Create() {
    // Anda mungkin perlu menerima props grup untuk RightSidebar jika belum ada
    const { auth, storeUrl, myGroups, recommendedGroups } = usePage().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const [imagePreview, setImagePreview] = useState(null);

    // ===================================================================
    // ====> 1. TAMBAHKAN STATE BARU & KONSTANTA UNTUK VALIDASI <====
    // ===================================================================
    const [imageError, setImageError] = useState('');
    const MAX_CHARS = 500;
    const MAX_FILE_SIZE_MB = 2; // Atur batas maksimal file dalam MB
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;


    const { data, setData, post, processing, errors, reset } = useForm({
        content: '',
        image: null,
    });
    
    const charsRemaining = MAX_CHARS - data.content.length;

    // ===================================================================
    // ====> 2. SESUAIKAN 'handleImageChange' DENGAN LOGIKA VALIDASI <====
    // ===================================================================
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validasi ukuran file sebelum di-set
            if (file.size > MAX_FILE_SIZE_BYTES) {
                // Jika file terlalu besar, tampilkan error dan reset
                setImageError(`Ukuran file tidak boleh lebih dari ${MAX_FILE_SIZE_MB}MB.`);
                setData('image', null);
                setImagePreview(null);
                e.target.value = ''; // Kosongkan input file
                return; // Hentikan fungsi
            }

            // Jika file valid, lanjutkan fungsi yang sudah ada
            setImageError(''); // Hapus error jika sebelumnya ada
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    // Sesuaikan removeImage untuk membersihkan error juga
    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
        setImageError(''); // Pastikan error juga dihapus
        document.getElementById('image-upload').value = '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Cegah submit jika ada error dari sisi klien
        if (imageError) return;
        
        post(storeUrl, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setImagePreview(null);
                setImageError('');
            },
        });
    };

    const handleContentChange = (e) => {
        const newContent = e.target.value;
        if (newContent.length <= MAX_CHARS) {
            setData('content', newContent);
        }
    };


    return (
        <div className="bg-light-bg min-h-screen text-stone-800">
            <div className="flex w-full max-w-screen-xl mx-auto">
                <LeftSidebar auth={auth} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

                <div className="flex-1 lg:ml-24 xl:ml-80">
                    <main className="w-full max-w-[600px] min-h-screen border-x border-stone-200">
                        
                        <div className="sticky top-0 bg-light-bg/80 backdrop-blur-md z-10 p-4 border-b border-stone-200 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link href="/dashboard" className="p-2 rounded-full hover:bg-stone-100">
                                    <ArrowLeftIcon className="h-5 w-5" />
                                </Link>
                                <h1 className="text-xl font-bold">Buat Postingan</h1>
                            </div>
                            <button
                                type="submit"
                                form="create-post-form"
                                disabled={processing || !data.content || charsRemaining < 0 || !!imageError}
                                className="bg-blue-600 text-white font-bold px-5 py-1.5 rounded-full text-sm hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Memposting...' : 'Posting'}
                            </button>
                        </div>

                        <form id="create-post-form" onSubmit={handleSubmit} className="p-4">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    {auth.user.avatar ? (
                                        <img src={`/storage/${auth.user.avatar}`} alt="Avatar" className="h-12 w-12 rounded-full object-cover"/>
                                    ) : (
                                        <div className="h-12 w-12 rounded-full bg-stone-200 flex items-center justify-center">
                                            <svg className="h-7 w-7 text-stone-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" /></svg>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="w-full">
                                    <textarea
                                        value={data.content}
                                        onChange={handleContentChange}
                                        className="w-full text-xl bg-transparent focus:outline-none resize-none"
                                        placeholder="Apa yang sedang terjadi?"
                                        rows={5}
                                    />
                                    {errors.content && <div className="text-red-500 text-sm mt-1">{errors.content}</div>}

                                    {imagePreview && (
                                        <div className="mt-3 relative">
                                            <img src={imagePreview} alt="Pratinjau gambar" className="rounded-2xl border border-stone-200 w-full" />
                                            <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black">
                                                <XMarkIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-stone-200">
                                <div className="flex items-center gap-4">
                                    <input type="file" id="image-upload" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    <label htmlFor="image-upload" className="cursor-pointer text-blue-600 p-2 rounded-full hover:bg-blue-100">
                                        <PhotoIcon className="h-6 w-6" />
                                    </label>
                                    
                                    {/* =================================================================== */}
                                    {/* ====> 3. TAMBAHKAN PETUNJUK UKURAN FILE <====                       */}
                                    {/* =================================================================== */}
                                    <span className="text-xs text-stone-500">Maks: {MAX_FILE_SIZE_MB}MB</span>

                                    <span className={`text-sm font-semibold ${charsRemaining < 20 ? 'text-red-500' : 'text-stone-500'}`}>
                                        {charsRemaining}
                                    </span>
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={processing || !data.content || charsRemaining < 0 || !!imageError}
                                    className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded-full text-sm hover:bg-blue-700 disabled:opacity-50 lg:hidden"
                                >
                                    Posting
                                </button>
                            </div>
                            {/* =================================================================== */}
                            {/* ====> 4. TAMPILKAN ERROR UKURAN FILE & ERROR DARI SERVER <====    */}
                            {/* =================================================================== */}
                            {imageError && <div className="text-red-500 text-sm mt-2">{imageError}</div>}
                            {errors.image && <div className="text-red-500 text-sm mt-2">{errors.image}</div>}
                        </form>
                    </main>
                </div>

                {/* Teruskan props grup ke RightSidebar */}
                <RightSidebar myGroups={myGroups} recommendedGroups={recommendedGroups} />
            </div>
        </div>
    );
}