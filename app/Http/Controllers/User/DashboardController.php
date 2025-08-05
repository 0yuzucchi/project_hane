<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Post;
use App\Models\Group;
use Illuminate\Support\Facades\Auth; // 1. Pastikan Auth diimpor

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user(); // Dapatkan pengguna yang sedang login

        // Query untuk postingan (tetap sama, sudah efisien)
        $posts = Post::with('user', 'likes')
            ->withCount('comments')
            ->latest()
            ->get();

        // --- Logika Baru untuk Memisahkan Grup ---

        // 2. Ambil semua ID grup yang sudah diikuti oleh pengguna
        $myGroupIds = $user->groups()->pluck('groups.id');

        // 3. Ambil data untuk widget "Grup Saya"
        // Mengambil grup yang ID-nya ada di dalam daftar $myGroupIds
        $myGroups = Group::whereIn('id', $myGroupIds)
            ->withCount('users')
            ->latest()
            ->take(5) // Batasi 5 grup
            ->get();
            
        // 4. Ambil data untuk widget "Rekomendasi Grup"
        // Mengambil grup yang ID-nya TIDAK ADA di dalam daftar $myGroupIds
        $recommendedGroups = Group::whereNotIn('id', $myGroupIds)
            ->withCount('users')
            ->latest()
            ->take(5) // Batasi 5 rekomendasi
            ->get();

        // --- Kirim data yang sudah dipisah ke Frontend ---
        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => $user,
            ],
            'posts' => $posts,
            'myGroups' => $myGroups,                 // <-- Data baru untuk "Grup Saya"
            'recommendedGroups' => $recommendedGroups, // <-- Data baru untuk "Rekomendasi"
            'createUrl' => route('posts.create'),
        ]);
    }
}