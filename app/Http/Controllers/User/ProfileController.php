<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Group;
use App\Models\Friendship;
use App\Models\Post;

class ProfileController extends Controller
{
    /**
     * Menampilkan halaman profil pribadi.
     */
    public function show()
    {
        $user = Auth::user();
        $user->loadCount('posts');

        $posts = Post::where('user_id', $user->id)
            ->with(['user', 'likes'])
            ->withCount('comments')
            ->latest()
            ->get();
        
        $userId = $user->id;
        $friendsCount = Friendship::where('status', 'accepted')
            ->where(function ($query) use ($userId) {
                $query->where('user_id', $userId)
                      ->orWhere('friend_id', $userId);
            })
            ->count();

        $myGroupIds = $user->groups()->pluck('groups.id');
        $myGroups = Group::whereIn('id', $myGroupIds)->withCount('users')->take(5)->get();
        $recommendedGroups = Group::whereNotIn('id', $myGroupIds)->withCount('users')->take(5)->get();

        return Inertia::render('Profile/Show', [
            'auth' => ['user' => $user],
            'user' => $user,
            'posts' => $posts,
            'friendsCount' => $friendsCount,
            'myGroups' => $myGroups,
            'recommendedGroups' => $recommendedGroups,
        ]);
    }

    /**
     * Menampilkan halaman profil publik.
     */
    public function showPublicProfile(User $user)
    {
        if (Auth::check() && Auth::id() === $user->id) {
            return redirect()->route('profile.show');
        }

        $user->loadCount('posts');
        $posts = Post::where('user_id', $user->id)
            ->with(['user', 'likes'])
            ->withCount('comments')
            ->latest()
            ->get();

        $userId = $user->id;
        $friendsCount = Friendship::where('status', 'accepted')
            ->where(fn($q) => $q->where('user_id', $userId)->orWhere('friend_id', $userId))
            ->count();
        
        $friendshipStatus = null;
        $myGroups = collect(); // Default ke koleksi kosong
        $recommendedGroups = collect(); // Default ke koleksi kosong

        if (Auth::check()) {
            $authId = Auth::id();
            $authUser = Auth::user();

            $friendship = Friendship::where(function ($q) use ($authId, $userId) {
                $q->where('user_id', $authId)->where('friend_id', $userId);
            })->orWhere(function ($q) use ($authId, $userId) {
                $q->where('user_id', $userId)->where('friend_id', $authId);
            })->first();

            if ($friendship) {
                $friendshipStatus = [
                    'status' => $friendship->status,
                    'sent_by_me' => $friendship->user_id === $authId,
                ];
            }

            // ===================================================================
            // ====> PENYESUAIAN: Ambil data grup untuk RightSidebar <====
            // ===================================================================
            $myGroupIds = $authUser->groups()->pluck('groups.id');
            $myGroups = Group::whereIn('id', $myGroupIds)->withCount('users')->take(5)->get();
            $recommendedGroups = Group::whereNotIn('id', $myGroupIds)->withCount('users')->take(5)->get();
        }

        return Inertia::render('Profile/UserProfile', [
            'auth' => ['user' => Auth::user()],
            'user' => $user,
            'posts' => $posts,
            'friendsCount' => $friendsCount,
            'friendshipStatus' => $friendshipStatus,
            'myGroups' => $myGroups, // <-- Kirim data grup
            'recommendedGroups' => $recommendedGroups, // <-- Kirim data grup
        ]);
    }

    /**
     * Menampilkan halaman edit profil.
     */
    public function edit()
    {
        $user = Auth::user();
        $myGroupIds = $user->groups()->pluck('groups.id');
        $myGroups = Group::whereIn('id', $myGroupIds)->withCount('users')->take(5)->get();
        $recommendedGroups = Group::whereNotIn('id', $myGroupIds)->withCount('users')->take(5)->get();

        return Inertia::render('Profile/Edit', [
            'auth' => ['user' => $user],
            'user' => $user,
            'myGroups' => $myGroups,
            'recommendedGroups' => $recommendedGroups,
        ]);
    }

    /**
     * Mengupdate data profil pengguna.
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'nullable|string|max:255|unique:users,username,' . $user->id,
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'bio' => 'nullable|string|max:255',
        ]);
        if ($request->hasFile('avatar')) {
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
            $validated['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }
        $user->update($validated);
        return redirect()->route('profile.show')->with('success', 'Profil berhasil diperbarui.');
    }

    /**
     * Mengecek ketersediaan username.
     */
    public function checkUsername(Request $request)
    {
        $request->validate(['username' => 'required|string']);
        $exists = User::where('username', $request->username)
                      ->where('id', '!=', Auth::id())
                      ->exists();
        return response()->json(['exists' => $exists]);
    }
}