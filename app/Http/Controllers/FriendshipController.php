<?php

namespace App\Http\Controllers;

use App\Models\Friendship;
use App\Models\User;
use App\Models\Group; // <-- 1. Pastikan model Group diimpor
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class FriendshipController extends Controller
{
    /**
     * Menampilkan halaman utama pertemanan.
     */
    public function index()
    {
        $user = Auth::user();
        $userId = $user->id;

        // Permintaan masuk (orang lain mengirim ke kita)
        $pending = Friendship::where('friend_id', $userId)
            ->where('status', 'pending')
            ->with('user')
            ->latest()->get();

        // Teman yang sudah diterima
        $friendships = Friendship::where('status', 'accepted')
            ->where(function ($query) use ($userId) {
                $query->where('user_id', $userId)
                      ->orWhere('friend_id', $userId);
            })
            ->with(['user', 'friend'])
            ->latest()->get()
            ->map(function ($friendship) use ($userId) {
                $friendUserObject = ($friendship->user_id == $userId)
                    ? $friendship->friend
                    : $friendship->user;
                return (object) [
                    'id' => $friendship->id,
                    'friend' => $friendUserObject,
                ];
            });

        // ===================================================================
        // ====> PENYESUAIAN: Ambil data grup untuk RightSidebar <====
        // ===================================================================
        $myGroupIds = $user->groups()->pluck('groups.id');
        $myGroups = Group::whereIn('id', $myGroupIds)->withCount('users')->take(5)->get();
        $recommendedGroups = Group::whereNotIn('id', $myGroupIds)->withCount('users')->take(5)->get();
        // ===================================================================

        return Inertia::render('FriendshipIndex', [
            'pending' => $pending,
            'friends' => $friendships,
            'auth' => ['user' => $user],
            'myGroups' => $myGroups, // <-- 2. Kirim data grup ke frontend
            'recommendedGroups' => $recommendedGroups, // <-- 2. Kirim data grup ke frontend
        ]);
    }

    /**
     * Mencari pengguna dan status pertemanannya.
     * (Tidak ada perubahan di sini)
     */
    public function searchUsers(Request $request)
    {
        $query = $request->query('query');
        $authId = Auth::id();

        if (!$query) {
            return response()->json([]);
        }

        $users = User::where('id', '!=', $authId)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', '%' . $query . '%')
                  ->orWhere('username', 'like', '%' . $query . '%');
            })
            ->addSelect([
                'friendship_status' => Friendship::select('status')
                    ->where(function ($q) use ($authId) {
                        $q->where('user_id', $authId)->whereColumn('friend_id', 'users.id');
                    })
                    ->orWhere(function ($q) use ($authId) {
                        $q->where('friend_id', $authId)->whereColumn('user_id', 'users.id');
                    })
                    ->limit(1),
                'request_sent_by' => Friendship::select('user_id')
                     ->where(function ($q) use ($authId) {
                        $q->where('user_id', $authId)->whereColumn('friend_id', 'users.id');
                    })
                    ->orWhere(function ($q) use ($authId) {
                        $q->where('friend_id', $authId)->whereColumn('user_id', 'users.id');
                    })
                    ->limit(1)
            ])
            ->limit(10)
            ->get();
        
        $filteredUsers = $users->filter(function ($user) use ($authId) {
            if ($user->friendship_status === 'accepted') {
                return false;
            }
            if ($user->friendship_status === 'pending' && $user->request_sent_by !== $authId) {
                return false;
            }
            return true;
        });

        return response()->json($filteredUsers->values());
    }
    
    // Metode lainnya (sendRequest, respondRequest, removeFriend) tidak perlu diubah
    // ...
    public function sendRequest(User $user)
    {
        $authUser = Auth::user();

        $exists = Friendship::where(fn($q) => $q->where('user_id', $authUser->id)->where('friend_id', $user->id))
            ->orWhere(fn($q) => $q->where('user_id', $user->id)->where('friend_id', $authUser->id))
            ->exists();

        if ($authUser->id === $user->id || $exists) {
            return Redirect::back()->with('error', 'Tidak dapat mengirim permintaan.');
        }

        Friendship::create([
            'user_id' => $authUser->id,
            'friend_id' => $user->id,
            'status' => 'pending',
        ]);

        return Redirect::back(303)->with('success', 'Permintaan pertemanan terkirim.');
    }

    public function respondRequest(Request $request, Friendship $friendship)
    {
        if ($friendship->friend_id !== Auth::id()) {
            abort(403, 'Tidak diizinkan.');
        }

        $validated = $request->validate([
            'status' => 'required|in:accepted,declined',
        ]);
        
        if ($validated['status'] === 'accepted') {
            $friendship->update(['status' => 'accepted']);
        } else {
            $friendship->delete();
        }

        return Redirect::back(303)->with('success', 'Permintaan telah direspons.');
    }

    public function removeFriend(User $user)
    {
        $authUser = Auth::user();

        $friendship = Friendship::where('status', 'accepted')
            ->where(function ($q) use ($authUser, $user) {
                $q->where('user_id', $authUser->id)->where('friend_id', $user->id);
            })
            ->orWhere(function ($q) use ($authUser, $user) {
                $q->where('user_id', $user->id)->where('friend_id', $authUser->id);
            })
            ->first();

        if ($friendship) {
            $friendship->delete();
            return Redirect::back(303)->with('success', 'Pertemanan dihapus.');
        }

        return Redirect::back(303)->with('error', 'Pertemanan tidak ditemukan.');
    }

}