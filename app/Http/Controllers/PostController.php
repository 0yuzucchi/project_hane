<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Group;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    /**
     * Menangani semua permintaan ke halaman pencarian.
     * Metode ini akan dipanggil untuk rute GET /search.
     * Ia akan menampilkan hasil jika ada keyword, atau tren jika tidak ada.
     */
    public function search(Request $request)
    {
        $user = Auth::user();
        $keyword = $request->input('keyword');

        // Ambil data sidebar (selalu dibutuhkan untuk konsistensi UI)
        $myGroupIds = $user->groups()->pluck('groups.id');
        $myGroups = Group::whereIn('id', $myGroupIds)->withCount('users')->take(5)->get();
        $recommendedGroups = Group::whereNotIn('id', $myGroupIds)->withCount('users')->take(5)->get();

        // **KONDISI 1: JIKA ADA KEYWORD DI URL** (Pengguna melakukan pencarian)
        if ($request->filled('keyword')) {

            // Validasi keyword untuk keamanan
            $request->validate(['keyword' => 'string|max:255']);

            // Lakukan pencarian post berdasarkan keyword
            // Di dalam PostController.php -> search()
            $posts = Post::query()
                ->with('user', 'likes') // <-- 'likes' ini PENTING
                ->withCount('comments') // <-- 'comments_count' ini PENTING
                ->where('content', 'like', "%{$keyword}%")
                ->latest()
                ->get();

            // Render halaman hasil pencarian
            return Inertia::render('Search', [
                'auth' => ['user' => $user],
                'posts' => $posts,
                'searchKeyword' => $keyword, // Kirim keyword yang dicari
                'trendingKeywords' => [],    // Tidak perlu data tren
                'myGroups' => $myGroups,
                'recommendedGroups' => $recommendedGroups,
            ]);
        }

        // **KONDISI 2: JIKA TIDAK ADA KEYWORD** (Pengguna mengunjungi halaman pencarian awal)

        // Dapatkan tren pencarian
        $trendingKeywords = Post::query()
            ->select('content')
            ->whereNotNull('content')
            ->latest()->take(20)->get()
            ->flatMap(fn($post) => explode(' ', $post->content))
            ->filter(fn($word) => strlen($word) > 1 && strlen($word) < 10 && !is_numeric($word))
            ->countBy()->sortDesc()->keys()->take(7);

        // Render halaman pencarian awal dengan tren
        return Inertia::render('Search', [
            'auth' => ['user' => $user],
            'posts' => [], // Kirim array post kosong
            'searchKeyword' => null, // Keyword null adalah sinyal untuk menampilkan tren
            'trendingKeywords' => $trendingKeywords, // Kirim data tren
            'myGroups' => $myGroups,
            'recommendedGroups' => $recommendedGroups,
        ]);
    }

    /**
     * Menampilkan halaman untuk membuat postingan baru.
     */
    public function create()
    {
        return Inertia::render('Posts/Create', [
            'auth' => ['user' => Auth::user()], // <-- Tambahkan data auth di sini
            'storeUrl' => route('posts.store'),
        ]);
    }

    /**
     * Menyimpan postingan baru ke database.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'content' => 'required|string|max:500',
            
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('posts', 'public');
        }

        $data['user_id'] = Auth::id();
        Post::create($data);

        return redirect()->route('dashboard')->with('success', 'Post berhasil dibuat!');
    }

    /**
     * Menyimpan postingan baru di dalam grup spesifik.
     */
    public function storeInGroup(Request $request, $groupId)
    {
        $data = $request->validate([
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('posts', 'public');
        }

        $data['user_id'] = Auth::id();
        $data['group_id'] = $groupId;
        Post::create($data);

        return redirect()->route('groups.show', $groupId)->with('success', 'Postingan grup berhasil ditambahkan!');
    }
    
}
