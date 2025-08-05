<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\GroupPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect; // Menggunakan Redirect facade untuk konsistensi
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class GroupController extends Controller
{
    use AuthorizesRequests;

    /**
     * Fungsi bantuan pribadi untuk mengambil data sidebar.
     * Tidak ada perubahan di sini, sudah efisien.
     */
    private function getSidebarData()
    {
        $user = Auth::user();
        if (!$user) {
            return [];
        }

        // Mengambil ID grup dimana pengguna adalah anggota.
        $myGroupIds = $user->groups()->pluck('groups.id');

        return [
            'myGroups' => Group::whereIn('id', $myGroupIds)->withCount('users')->latest()->take(5)->get(),
            'recommendedGroups' => Group::whereNotIn('id', $myGroupIds)->withCount('users')->latest()->take(5)->get(),
        ];
    }

    /**
     * Menampilkan halaman daftar semua grup.
     */
    public function index()
    {
        $user = Auth::user();

        // --- PENYESUAIAN 1: Optimasi Kueri untuk Mencegah N+1 ---
        // Ambil ID grup milik pengguna terlebih dahulu untuk menghindari kueri di dalam loop.
        $userGroupIds = $user->groups()->pluck('groups.id')->flip();

        $groups = Group::with('owner')
            ->withCount(['users', 'groupPosts'])
            ->latest() // Menambahkan latest() untuk mengurutkan dari yang terbaru
            ->get()
            ->map(function ($group) use ($userGroupIds) {
                // Sekarang pengecekan dilakukan di memori, bukan ke database. Jauh lebih cepat.
                $group->is_member = $userGroupIds->has($group->id);
                return $group;
            });

        return Inertia::render('Groups/Index', [
            'groups' => $groups,
            'auth' => ['user' => $user],
            // Menggabungkan data dengan cara ini lebih mudah dibaca daripada array_merge
            ...$this->getSidebarData()
        ]);
    }

    /**
     * Menampilkan halaman untuk membuat grup baru.
     */
    public function create()
    {
        return Inertia::render('Groups/Create', [
            'auth' => ['user' => Auth::user()],
            ...$this->getSidebarData()
        ]);
    }

    /**
     * Menyimpan grup baru ke database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $group = Group::create([
            ...$validated, // Menggunakan spread operator dari data yang sudah divalidasi
            'owner_id' => Auth::id(),
        ]);

        // Secara otomatis menjadikan pembuat sebagai admin
        $group->users()->attach(Auth::id(), ['role' => 'admin']);

        // --- PENYESUAIAN 2: Arahkan ke Halaman Detail Grup Baru ---
        // Ini memberikan pengalaman pengguna yang lebih baik daripada kembali ke daftar.
        return Redirect::route('groups.show', $group->id)->with('success', 'Grup berhasil dibuat.');
    }

    /**
     * Menampilkan halaman detail satu grup.
     */
    // --- PENYESUAIAN 3: Menggunakan Route-Model Binding untuk Konsistensi ---
    public function show(Group $group)
    {
        // Memuat relasi anggota dan pemilik
        $group->load('users', 'owner');

        $groupPosts = GroupPost::with('user')
            ->withCount('comments')
            ->where('group_id', $group->id)
            ->latest()
            ->get();

        return Inertia::render('Groups/Show', [
            'group' => $group,
            'groupPosts' => $groupPosts,
            'storeGroupPostUrl' => route('groups.posts.store', $group->id),
            'auth' => ['user' => Auth::user()],
            ...$this->getSidebarData()
        ]);
    }

    /**
     * Menampilkan halaman untuk mengedit grup.
     */
    public function edit(Group $group)
    {
        $this->authorize('update', $group); // Otorisasi sudah benar

        return Inertia::render('Groups/Edit', [
            'group' => $group,
            'auth' => ['user' => Auth::user()],
            ...$this->getSidebarData()
        ]);
    }

    /**
     * Mengupdate data grup di database.
     */
    public function update(Request $request, Group $group)
{
    $this->authorize('update', $group);

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
    ]);

    $group->update($validated);

    // Ini sudah benar, mengarah ke halaman lain.
    // Jika Anda mengubah ini ke 'groups.edit', itu akan menyebabkan masalah.
    return redirect()->route('groups.show', $group->id)->with('success', 'Grup berhasil diperbarui.');
}


    /**
     * Menghapus grup dari database.
     */
    public function destroy(Group $group)
    {
        $this->authorize('delete', $group);
        $group->delete();
        return Redirect::route('groups.index')->with('success', 'Grup berhasil dihapus.');
    }

    /**
     * Mengizinkan pengguna untuk bergabung ke grup.
     */
    public function join(Group $group)
    {
        // --- PENYESUAIAN 5: Optimasi Pengecekan Keanggotaan ---
        // Menggunakan exists() jauh lebih efisien daripada memuat semua anggota.
        if (!$group->users()->where('user_id', Auth::id())->exists()) {
            $group->users()->attach(Auth::id(), ['role' => 'member']); // Beri peran 'member'
        }

        return Redirect::route('groups.show', $group->id)->with('success', 'Berhasil bergabung ke grup.');
    }

    /**
     * Menampilkan halaman detail untuk satu postingan grup.
     */
    public function showPost(GroupPost $groupPost)
    {
        $groupPost->load(['user', 'group']); // Memuat relasi user dan grup induk

        return Inertia::render('Groups/PostDetail', [
            'auth' => ['user' => Auth::user()],
            'post' => $groupPost,
            ...$this->getSidebarData()
        ]);
    }
}   