import React, { useState, useRef, useEffect } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import LeftSidebar from '@/Components/LeftSidebar';
import RightSidebar from '@/Components/RightSidebar';

// Import Ikon
import { ArrowLeftIcon, Bars3Icon, PhotoIcon } from '@heroicons/react/24/solid';

// Komponen Utama Halaman Edit Profile
export default function Edit() {
    // Mengambil data user yang sedang login dari props global Inertia
    const { auth } = usePage().props;
    const user = auth.user;
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // State untuk pratinjau avatar & ref untuk input file
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);

    // ===================================================================
    // ====> 1. STATE BARU UNTUK VALIDASI USERNAME REAL-TIME <====
    // ===================================================================
    const [usernameStatus, setUsernameStatus] = useState('idle'); // 'idle', 'checking', 'available', 'taken'
    const [usernameMessage, setUsernameMessage] = useState('');
    const originalUsername = user?.username || ''; // Simpan username asli untuk perbandingan

    const { data, setData, post, processing, errors, reset } = useForm({
        _method: 'PATCH', // Menggunakan PATCH untuk update lebih sesuai secara semantik
        name: user?.name || '',
        username: user?.username || '',
        // bio: user?.bio || '', // Pastikan bio juga ada di form
        avatar: null,
    });

    // ===================================================================
    // ====> 2. LOGIKA UNTUK MENGECEK USERNAME SAAT PENGGUNA MENGETIK <====
    // ===================================================================
    useEffect(() => {
        // Jangan cek jika username kosong atau sama dengan aslinya
        if (!data.username.trim() || data.username === originalUsername) {
            setUsernameStatus('idle');
            return;
        }

        setUsernameStatus('checking');
        setUsernameMessage('Mengecek ketersediaan...');

        // Debounce: Menunggu 500ms setelah pengguna berhenti mengetik
        const handler = setTimeout(() => {
            fetch('/check-username', { // Panggil route baru yang kita buat
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({ username: data.username }),
            })
            .then(response => response.json())
            .then(result => {
                if (result.exists) {
                    setUsernameStatus('taken');
                    setUsernameMessage('Username ini sudah digunakan.');
                } else {
                    setUsernameStatus('available');
                    setUsernameMessage('Username tersedia!');
                }
            })
            .catch(() => {
                setUsernameStatus('idle'); // Kembali ke idle jika ada error koneksi
            });
        }, 500);

        // Membersihkan timeout jika pengguna mengetik lagi sebelum 500ms selesai
        return () => {
            clearTimeout(handler);
        };
    }, [data.username]); // Jalankan efek ini setiap kali 'data.username' berubah

    // Fungsi untuk menangani perubahan file & membuat pratinjau (tidak diubah)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mengirimkan data ke rute update profil.
        post('/profile/update', {
            forceFormData: true,
            onSuccess: () => {
                reset('avatar');
                setAvatarPreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                }
            },
        });
    };
    
    // Variabel untuk menentukan warna pesan status username
    const messageColor = {
        checking: 'text-stone-500',
        available: 'text-green-600',
        taken: 'text-red-500',
    }[usernameStatus];

    return (
        <div className="bg-light-bg min-h-screen text-stone-800">
            <div className="flex w-full max-w-screen-xl mx-auto">
                <LeftSidebar auth={auth} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

                <div className="flex-1 w-full lg:ml-24 xl:ml-80">
                    <main className="w-full max-w-none lg:max-w-[600px] min-h-screen border-x-0 lg:border-x border-stone-200">
                        
                        <div className="sticky top-0 bg-light-bg/80 backdrop-blur-md z-10 p-4 border-b border-stone-200 flex items-center gap-4">
                            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-1 rounded-full"><Bars3Icon className="h-6 w-6" /></button>
                            <Link href="/profile" className="p-2 rounded-full hover:bg-stone-100 hidden lg:block">
                                <ArrowLeftIcon className="h-5 w-5" />
                            </Link>
                            <h1 className="text-xl font-bold">Edit Profile</h1>
                        </div>

                        <div className="p-4 sm:p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                
                                {/* Input Avatar dengan Pratinjau */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-stone-700">Foto Profil</label>
                                    <div className="flex items-center gap-4">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Pratinjau Avatar" className="h-20 w-20 rounded-full object-cover" />
                                        ) : user.avatar ? (
                                            <img src={`/storage/${user.avatar}`} alt="Avatar" className="h-20 w-20 rounded-full object-cover" />
                                        ) : (
                                            <div className="h-20 w-20 rounded-full bg-stone-200 flex items-center justify-center">
                                                <svg className="h-12 w-12 text-stone-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
                                                </svg>
                                            </div>
                                        )}
                                        <input type="file" id="avatar-upload" onChange={handleFileChange} className="hidden" ref={fileInputRef} accept="image/*" />
                                        <label htmlFor="avatar-upload" className="cursor-pointer bg-stone-200 text-stone-800 font-bold px-4 py-2 rounded-full text-sm hover:bg-stone-300 transition-colors">
                                            Ganti Foto
                                        </label>
                                    </div>
                                    {errors.avatar && <p className="text-red-500 text-xs mt-2">{errors.avatar}</p>}
                                </div>

                                {/* Input Nama */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold mb-1 text-stone-700">Nama</label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full bg-stone-100 text-stone-800 border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                {/* Input Username */}
                                <div>
                                    <label htmlFor="username" className="block text-sm font-semibold mb-1 text-stone-700">Username</label>
                                    <input
                                        id="username"
                                        type="text"
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        className="w-full bg-stone-100 text-stone-800 border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        autoComplete="off"
                                    />
                                    {/* =================================================================== */}
                                    {/* ====> 3. TAMPILKAN PESAN STATUS VALIDASI & ERROR BAWAAN <====       */}
                                    {/* =================================================================== */}
                                    {usernameStatus !== 'idle' && (
                                        <p className={`text-xs mt-1 font-semibold ${messageColor}`}>{usernameMessage}</p>
                                    )}
                                    {errors.username && (
                                        <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                                    )}
                                </div>
                                
                                {/* Tombol Submit */}
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        // 4. Tombol dinonaktifkan jika sedang memproses ATAU username tidak valid
                                        disabled={processing || usernameStatus === 'taken' || usernameStatus === 'checking'}
                                        className="bg-blue-600 text-white font-bold px-6 py-2 rounded-full hover:bg-blue-700 transition-all shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Menyimpan...' : 'Perbarui Profil'}
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