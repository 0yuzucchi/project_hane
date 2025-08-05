import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

// Import Ikon untuk tombol password
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <>
      <Head title="Masuk" />
      {/* 
        ===================================================================
        PERUBAHAN UTAMA: Struktur ini sekarang mengisi seluruh layar.
        'flex' akan mengatur kedua panel anak secara berdampingan.
        ===================================================================
      */}
      <div className="min-h-screen bg-light-bg flex">
          
          {/* Panel Kiri (Visual - Tersembunyi di Mobile) */}
          <div 
            className="hidden md:flex md:w-1/2 bg-stone-800 text-white p-12 flex-col justify-between relative bg-cover bg-center" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1482398292594-3457136dc16f?q=80&w=1887&auto=format&fit=crop')" }}
          >
            <div className="absolute inset-0 bg-purple-900/40 mix-blend-multiply"></div>
            <div className="relative z-10 flex flex-col h-full">
                <Link href="/" className="text-2xl font-bold tracking-wider">HANE</Link>
                <div className="flex-grow flex flex-col justify-center">
                    <h1 className="text-4xl font-bold leading-tight">Welcome Back,</h1>
                    <h1 className="text-4xl font-bold">Continue Your Journey.</h1>
                    <p className="text-purple-200 mt-4 max-w-md">Masuk untuk melihat apa yang baru dari teman dan grup yang Anda ikuti.</p>
                </div>
            </div>
          </div>

          {/* Panel Kanan (Form Login) */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
            <div className="w-full max-w-md">
                <h2 className="text-3xl font-bold text-stone-900">Masuk ke Akun Anda</h2>
                <p className="text-stone-500 mt-2">
                  Belum punya akun?{' '}
                  <Link href="/register" className="text-blue-600 font-semibold hover:underline">
                    Buat akun gratis
                  </Link>
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-stone-700">Email</label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      className="w-full bg-stone-100 text-stone-800 border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <label className="block text-sm font-semibold mb-1 text-stone-700">Password</label>
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      className="w-full bg-stone-100 text-stone-800 border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute inset-y-0 right-0 top-6 px-3 flex items-center text-stone-500 hover:text-blue-600">
                        {passwordVisible ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                    </button>
                    {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                  </div>

                  {/* Ingat Saya & Lupa Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-stone-600">Ingat saya</span>
                    </label>
                    <Link href="#" className="text-sm text-blue-600 hover:underline">
                        Lupa Password?
                    </Link>
                  </div>
                  
                  <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                        disabled={processing}
                      >
                        {processing ? 'Memproses...' : 'Masuk'}
                      </button>
                  </div>

                  {/* Separator dan Opsi Login Lain */}
                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-stone-300"></div>
                        <span className="flex-shrink mx-4 text-xs text-stone-500">ATAU MASUK DENGAN</span>
                        <div className="flex-grow border-t border-stone-300"></div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="#" className="w-full flex items-center justify-center gap-2 border border-stone-300 py-2 rounded-full hover:bg-stone-100 transition-colors">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5"/>
                            <span className="text-sm font-semibold">Google</span>
                        </Link>
                    </div>

                </form>
            </div>
          </div>
        </div>
    </>
  );
}